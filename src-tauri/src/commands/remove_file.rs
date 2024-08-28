use std::fs;
use std::path::Path;
use tauri::Window;
use tokio::task;

#[tauri::command]
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
