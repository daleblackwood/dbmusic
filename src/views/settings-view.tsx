import { Settings } from "@model";
import { libraryService } from "@services";
import { css } from "@utils";
import { useSubject } from "observational/hooks";

const style = css`
	.settings {
		padding-top: 100px;
	}

	.settings input {
		appearance: auto;
	}

	.panel {
		background: #111;
		padding: 1rem;
		margin: 0 0 2rem;
	}

	.field {
		padding: 0.5rem 0;
	}
`;

export function SettingsView() {
	const [settings, setSettings] = useSubject(libraryService.subSettings);
	function updateSettings(newSettings: Partial<Settings>) {
		if (!settings)
			return;
		setSettings({ ...settings, ...newSettings });
	}
	function toggleSetting(setting: keyof Settings) {
		if (!settings)
			return;
		updateSettings({ ...settings, [setting]: !settings[setting] })
	}
	return (
		<div className={style.settings}>
			<h4>Settings</h4>
			<div className={style.panel}>
				<form>
					<div className={style.field}>
						<input 
							id="grouped"
							type="checkbox"
							checked={settings?.grouped}
							onChange={() => toggleSetting("grouped")}
						/>
						<label htmlFor="grouped">Show Grouping</label>
					</div>
					<div className={style.field}>
						<input 
							id="showFormative"
							type="checkbox" 
							checked={settings?.showFormative}
							onChange={() => toggleSetting("showFormative")}
						/>
						<label htmlFor="showFormative">Show Formative</label>
					</div>
				</form>
			</div>
			<h4>About DbMusic</h4>
			<div className={style.panel}>
				<p>
					DbMusic (pronounced D Flat Music) was built by Dale Blackwood to archive and make accessible some of his lesser
					known works on <a href="https://music.daleblackwood.com" target="_blank">music.daleblackwood.com.</a>
				</p>
				<p>
					The application was built from ground up using React and Howler libraries on a Vite and NodeJS toolchain. The source code and licensing information is publically available on <a href="https://github.com/daleblackwood/dbmusic" target="_blank">Dale's Github.</a>
				</p>
			</div>
		</div>
	);
}
