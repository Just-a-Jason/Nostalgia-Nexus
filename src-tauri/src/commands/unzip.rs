use std::fs::{self, File};
use std::io::{self, BufReader};
use std::path::Path;
use tauri::command;
use tauri::Window;
use tokio::task;
use zip::read::ZipArchive;

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
