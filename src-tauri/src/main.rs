// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::Client;
use std::fs::{self, File};
use std::io::{self, BufReader, Read, Write};
use std::path::Path;
use tauri::Window;
use tokio::task;
use zip::read::ZipArchive;

#[tauri::command]
async fn unzip_file(window: Window, zip_path: String, dest_path: String) -> Result<(), String> {
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
                        "operation": "Unziping game files..."
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

#[tauri::command]
async fn download_file(window: Window, url: String, dest: String) -> Result<(), String> {
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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![download_file, unzip_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
