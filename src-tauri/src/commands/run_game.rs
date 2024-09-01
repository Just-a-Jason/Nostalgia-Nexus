use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use tauri::command;
use tauri::Window;
use winapi::um::winbase::CREATE_NO_WINDOW;

#[command]
pub async fn run_game(window: Window, dir_path: String) -> Result<(), String> {
    Command::new("cmd")
        .args(&["/C", "cd", &dir_path, "&&", "start", "game.exe"])
        .creation_flags(CREATE_NO_WINDOW)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| e.to_string())?;
    window
        .emit("game-started", "Game started successfully")
        .unwrap();
    Ok(())
}
