<?php

require_once('_getid3/getid3.php');

$folder_path = 'music';
$cache_file = 'cache.json';

if (file_exists($cache_file)){
    $cache = json_decode(file_get_contents($cache_file), true);
} else {
    $cache = array();
}

$VIDEO_EXTS = array('mp4', 'mov', 'avi', 'mkv');
$SOUND_EXTS = array('mp3', 'wav', 'ogg', 'flac', 'm4a');
$IMAGE_EXTS = array('jpg', 'gif', 'svg', 'png');    
$TEXT_EXTS = array('txt', 'json');

$getid3 = new getID3();

function has_extension($file, array ...$extensions_array) {
    if ($file == null || empty($file))
        return false;
    $file_type = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    foreach ($extensions_array as $extensions) {
        if (in_array($file_type, $extensions)) {
            return true;
        }
    }
    return false;
}

function get_first_value($obj, $field_name) {
    if (isset($obj[$field_name])) {
        if (is_array($obj[$field_name]))
            return $obj[$field_name][0];
        return $obj[$field_name];
    }
    return null;
}

function scan_folder($folder_path, &$cache) {
    global $getid3, $VIDEO_EXTS, $SOUND_EXTS, $IMAGE_EXTS, $TEXT_EXTS;
    $files = scandir($folder_path);
    $cover = $folder_path . '/Cover.jpg';
    $media_files = array();
    foreach ($files as $file) {
        if (substr($file, 0, 1) === '.')
            continue;

        $full_path = $folder_path . '/' . $file;
        if (is_dir($full_path)) {
            scan_folder($full_path, $cache, $getid3);
            continue;
        }

        if (has_extension($file, $IMAGE_EXTS)) {
            if (substr(strtolower($file), 0, 5) == 'cover') {
                $cover = $full_path;
            }
        }

        if (has_extension($file, $VIDEO_EXTS, $SOUND_EXTS, $TEXT_EXTS)) {
            array_push($media_files, $file);
        }
    }
    foreach ($media_files as $file) {
        $full_path = $folder_path . '/' . $file;
        $modified = filemtime($full_path);
        $date = date('Y-m-d H:i:s', $modified);
        $number = 0;
        $name = title_case(pathinfo($file, PATHINFO_EXTENSION), $file);
        if (preg_match('/^(\d+)(\D+)/', $file, $matches)) {
            $number = $matches[1];
            $name = $matches[2];
        }

        if (isset($cache[$full_path]) && $date == $cache[$full_path]['date'])
            continue;

        $cache[$full_path] = array(
            'date' => $date, 
            'name' => $name,
            'number' => (int)$number,
            'path' => $full_path,
            'cover' => $cover,
            'year' => date('Y', $modified)
        );
        if (has_extension($full_path, $SOUND_EXTS)) {
            $file_info = $getid3->analyze($full_path);
            getid3_lib::CopyTagsToComments($file_info);
            process_comments($cache[$full_path], $file_info['comments'], $cover);
        }
    }
}

function process_comments(&$entry, $comments, $cover) {
    $entry['name'] = title_case(get_comment_value($comments, 'title', $entry['name']));
    $entry['number'] = (int)get_comment_value($comments, 'track_number', $entry['number']);
    $entry['album'] = title_case(get_comment_value($comments, 'album', basename(dirname($entry['path']))));
    $entry['artist'] = title_case(get_comment_value($comments, 'artist', 'Dale Blackwood'));
    $entry['year'] = (int)get_comment_value($comments, 'year', $entry['year']);
    $entry['genre'] = title_case(get_comment_value($comments, 'genre', ''));
    $entry['rating'] = get_comment_value($comments, 'rating', '');

    $coverPath = get_comment_value($comments, 'cover', '');
    if (!empty($coverPath) && file_exists($coverPath)) {
        $outputFolder = 'covers';
        if (!is_dir($outputFolder)) {
            mkdir($outputFolder);
        }

        $resizedCoverPath = $outputFolder . '/' . basename($coverPath);
		if (!file_exists($resizedCoverPath)) {
			resize_cover_image($coverPath, $resizedCoverPath, 256, 256);
		}

        $entry['cover'] = $resizedCoverPath;
    } else {
        $entry['cover'] = 'Cover.jpg';
    }
}

function get_comment_value($comments, $key, $default = '') {
    if (!empty($comments) && isset($comments[$key])) {
        return $comments[$key][0];
    }
    return $default;
}

function title_case($string) {
    $string = trim($string);
    $string = str_replace('_', ' ', $string);
    $string = preg_replace('/\s+/', ' ', $string);
    $string = ucwords(strtolower($string));
    return $string;
}

function resize_cover_image($sourceImagePath) {
    $baseName = pathinfo($sourceImagePath, PATHINFO_FILENAME);
    $newFileName = "_" . $baseName . "_256.jpg";

    if (file_exists($newFileName)) {
        return $newFileName;
    }

    $sourceImage = imagecreatefromstring(file_get_contents($sourceImagePath));

    $sourceWidth = imagesx($sourceImage);
    $sourceHeight = imagesy($sourceImage);
    $aspectRatio = $sourceWidth / $sourceHeight;

    $resizedImage = imagecreatetruecolor(256, 256);

    if ($aspectRatio > 1) {
        $targetWidth = 256;
        $targetHeight = intval(256 / $aspectRatio);
        $offsetX = 0;
        $offsetY = intval((256 - $targetHeight) / 2);
    } else {
        $targetWidth = intval(256 * $aspectRatio);
        $targetHeight = 256;
        $offsetX = intval((256 - $targetWidth) / 2);
        $offsetY = 0;
    }

    imagecopyresampled($resizedImage, $sourceImage, $offsetX, $offsetY, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);

    imagejpeg($resizedImage, $newFileName);

    imagedestroy($sourceImage);
    imagedestroy($resizedImage);

    return $newFileName;
}

scan_folder($folder_path, $cache, $getid3);

file_put_contents($cache_file, json_encode($cache));

$output = array();
foreach ($cache as $file) {
    $output[] = $file;
}

header('Content-Type: application/json');
echo json_encode($output);

?>
