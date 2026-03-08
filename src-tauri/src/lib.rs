mod ai;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Load .env file if present
    let _ = dotenv::from_filename("../.env");
    let _ = dotenv::dotenv();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![ai::generate_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
