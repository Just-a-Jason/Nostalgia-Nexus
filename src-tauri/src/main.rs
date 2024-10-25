// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            commands::file_managment::download_file,
            commands::file_managment::unzip_file,
            commands::file_managment::remove_file,
            commands::run_game::run_game,
            commands::file_managment::get_folder_size,
            commands::file_managment::create_desktop_shortcut,
            commands::file_managment::create_meta_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
