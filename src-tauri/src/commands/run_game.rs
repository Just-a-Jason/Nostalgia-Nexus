use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::time::Instant;
use tauri::command;
use tauri::Window;
use winapi::um::winbase::CREATE_NO_WINDOW;

#[command]
pub async fn run_game(window: Window, dir_path: String) -> Result<(), String> {
    let result = Command::new("cmd")
        .args(&["/C", "cd", &dir_path, "&&", "game.exe"])
        .creation_flags(CREATE_NO_WINDOW)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn();

    if let Ok(mut child_process) = result {
        // Tell the launcher wich game started
        window
            .emit("game-started", {
                serde_json::json!({
                    "gameName": "idk"
                })
            })
            .map_err(|e| e.to_string())?;

        // Start the timer
        let timer = Instant::now();
        let _ = child_process.wait();

        // The game has been closed, now calculate the time in-game
        println!("{:?}", timer.elapsed());

        // Tell the launcher wich game ended
        window
            .emit("game-ended", {
                serde_json::json!({
                    "gameName": "idk",
                    "totalPlayTime": timer.elapsed()
                })
            })
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
