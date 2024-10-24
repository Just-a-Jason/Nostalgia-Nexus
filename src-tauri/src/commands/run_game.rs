use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::time::Instant;
use tauri::command;
use winapi::um::winbase::CREATE_NO_WINDOW;

#[command]
pub async fn run_game(dir_path: String) -> Result<(), String> {
    let result = Command::new("cmd")
        .args(&["/C", "cd", &dir_path, "&&", "game.exe"])
        .creation_flags(CREATE_NO_WINDOW)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn();

    if let Ok(mut child_process) = result {
        // Start the timer
        let timer = Instant::now();
        let _ = child_process.wait();

        // Game closed time to check the time spent
        println!("{:?}", timer.elapsed());
    }

    Ok(())
}
