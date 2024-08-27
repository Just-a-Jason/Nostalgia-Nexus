// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::Client;
use std::fs::File;
use std::io::{Read, Write};
use tauri::Window;
use tokio::task;

#[tauri::command]
async fn download_file(window: Window, url: String, dest: String) -> Result<(), String> {
    task::spawn_blocking(move || {
        let client = Client::new();
        let mut response = client.get(&url).send().unwrap();
        let total_size = response.content_length().unwrap();
        window.emit("file-size", total_size).unwrap(); // Emit total file size
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
        .invoke_handler(tauri::generate_handler![download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
