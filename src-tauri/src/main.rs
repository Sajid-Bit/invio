// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod commands;

use tauri::Manager;

#[tokio::main]
async fn main() {
    // Initialize database
    let db_pool = db::init_database()
        .await
        .expect("Failed to initialize database");

    tauri::Builder::default()
        .manage(db_pool)
        .invoke_handler(tauri::generate_handler![
            commands::get_daily_budget,
            commands::get_daily_expenses,
            commands::get_today_transactions,
            commands::add_transaction,
            commands::search_transactions,
            commands::export_transactions_pdf,
            commands::get_all_users,
            commands::add_user,
            commands::update_user,
            commands::delete_user,
            commands::get_user_activity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
