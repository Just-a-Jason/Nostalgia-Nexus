use mslnk::ShellLink;
use reqwest::blocking::Client;
use std::fs;
use std::fs::File;
use std::io;
use std::io::{BufReader, Read, Write};
use std::path::Path;
use tauri::command;
use tauri::Window;
use tokio::task;
use zip::read::ZipArchive;

#[command]
pub fn create_desktop_shortcut(app_name: String, app_path: String) -> Result<String, String> {
    let app_path = std::path::Path::new(&app_path);

    let shortcut_path = dirs::desktop_dir()
        .ok_or("Could not find desktop directory")?
        .join(format!("{}.lnk", app_name));

    let sl = ShellLink::new(&app_path).map_err(|e| e.to_string())?;
    sl.create_lnk(&shortcut_path).map_err(|e| e.to_string())?;

    Ok(shortcut_path.to_string_lossy().to_string())
}

#[command]
pub async fn download_file(window: Window, url: String, dest: String) -> Result<(), String> {
    task::spawn_blocking(move || {
        let client = Client::new();
        let mut response = client.get(&url).send().unwrap();
        let total_size = response.content_length().unwrap();
        window.emit("file-size", total_size).unwrap();
        let mut file = File::create(&dest).unwrap();
        let mut downloaded: u64 = 0;
        let mut buffer = [0; 8192];
        let start_time = std::time::Instant::now();

        while let Ok(n) = response.read(&mut buffer) {
            if n == 0 {
                break;
            }
            file.write_all(&buffer[..n]).unwrap();
            downloaded += n as u64;
            let elapsed_time = start_time.elapsed().as_secs_f64();
            let download_speed = downloaded as f64 / elapsed_time; // bytes per second
            let remaining_time = (total_size - downloaded) as f64 / download_speed; // seconds
            let progress = (downloaded as f64 / total_size as f64) * 100.0;

            window
                .emit("download-progress", {
                    let progress_data = serde_json::json!({
                        "fileSize": total_size,
                        "downloaded": downloaded,
                        "progress": progress,
                        "remainingTime": remaining_time,
                        "operation": "Downloading files..."
                    });
                    progress_data
                })
                .unwrap();
        }

        Ok(())
    })
    .await
    .unwrap()
}

#[command]
pub fn get_folder_size(folder_path: String) -> Result<u64, String> {
    fn get_size(path: &Path) -> io::Result<u64> {
        let mut size = 0;

        if path.is_dir() {
            for entry in fs::read_dir(path)? {
                let entry = entry?;
                let path = entry.path();
                size += get_size(&path)?;
            }
        } else {
            size += fs::metadata(path)?.len();
        }

        Ok(size)
    }

    let path = Path::new(&folder_path);
    match get_size(&path) {
        Ok(size) => Ok(size),
        Err(err) => Err(err.to_string()),
    }
}

#[command]
pub async fn remove_file(window: Window, path: String) -> Result<(), String> {
    task::spawn_blocking(move || {
        let path = Path::new(&path);
        if path.exists() {
            if path.is_file() {
                fs::remove_file(path).map_err(|e| e.to_string())?;
            } else if path.is_dir() {
                fs::remove_dir_all(path).map_err(|e| e.to_string())?;
            }
            window
                .emit("path-removed", path.to_string_lossy().into_owned())
                .unwrap();
        } else {
            return Err("Path does not exist".to_string());
        }
        Ok(())
    })
    .await
    .unwrap()
}

#[command]
pub async fn unzip_file(window: Window, zip_path: String, dest_path: String) -> Result<(), String> {
    task::spawn_blocking(move || {
        let file = File::open(&zip_path).map_err(|e| e.to_string())?;
        let mut archive = ZipArchive::new(BufReader::new(file)).map_err(|e| e.to_string())?;
        let total_files = archive.len();

        for i in 0..total_files {
            let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
            let outpath = match file.enclosed_name() {
                Some(path) => Path::new(&dest_path).join(path),
                None => continue,
            };

            if file.name().ends_with('/') {
                std::fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
            } else {
                if let Some(p) = outpath.parent() {
                    if !p.exists() {
                        std::fs::create_dir_all(&p).map_err(|e| e.to_string())?;
                    }
                }
                let mut outfile = File::create(&outpath).map_err(|e| e.to_string())?;
                io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
            }

            let progress = ((i + 1) as f64 / total_files as f64) * 100.0;

            window
                .emit("download-progress", {
                    let progress_data = serde_json::json!({
                        "fileSize": 0,
                        "downloaded": 0,
                        "progress": progress,
                        "remainingTime": 0,
                        "operation": "Unzipping game files..."
                    });
                    progress_data
                })
                .unwrap();
        }

        fs::remove_file(&zip_path).map_err(|e| e.to_string())?;

        Ok(())
    })
    .await
    .unwrap()
}
