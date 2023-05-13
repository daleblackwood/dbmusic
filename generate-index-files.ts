import { Plugin } from 'vite';
import { readdirSync, writeFileSync, statSync } from 'fs';
import { resolve, join } from 'path';

interface PluginOptions {
  extensions?: string[];
}

const defaultOptions: PluginOptions = {
  extensions: ['.ts', '.tsx', '.svg'],
};

function generateIndexFiles(options: PluginOptions = defaultOptions): Plugin {
  return {
    name: 'generate-index-files',
    apply: 'build',
    transformIndexHtml() {
      const rootDir = process.cwd();
      generateIndexFilesRecursively(rootDir, options.extensions || []);
    },
  };
}

function generateIndexFilesRecursively(dir: string, extensions: string[]) {
  const files = readdirSync(dir);
  const subdirectories: string[] = [];

  for (const file of files) {
    const filePath = join(dir, file);
    const isDirectory = isDirectorySync(filePath);
    const hasValidExtension = extensions.some((ext) => file.endsWith(ext));

    if (isDirectory) {
      subdirectories.push(filePath);
    } else if (hasValidExtension) {
      const exportStatements = generateExportStatements(dir, file);
      const indexFilePath = join(dir, 'index.ts');
      writeFileSync(indexFilePath, exportStatements);
    }
  }

  for (const subdir of subdirectories) {
    generateIndexFilesRecursively(subdir, extensions);
  }
}

function generateExportStatements(dir: string, file: string): string {
  const relativePath = './' + join(dir, file).replace(/\\/g, '/');
  const exportStatement = `export * from '${relativePath}';\n`;
  return exportStatement;
}

function isDirectorySync(path: string): boolean {
	const stat = statSync(path);
	return stat.isDirectory();
}

export default generateIndexFiles;
