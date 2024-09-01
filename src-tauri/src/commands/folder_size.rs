use std::fs;
use std::io;
use std::path::Path;
use tauri::command;

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
