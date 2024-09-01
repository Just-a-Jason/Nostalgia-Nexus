// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::download::download_file,
            commands::unzip::unzip_file,
            commands::remove_file::remove_file,
            commands::run_game::run_game,
            commands::folder_size::get_folder_size
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
