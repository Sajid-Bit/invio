use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::fs;

pub type DbPool = Pool<Sqlite>;

pub async fn init_database() -> Result<DbPool, sqlx::Error> {
    // Create data directory if it doesn't exist
    let data_dir = std::env::current_dir()
        .unwrap()
        .join("data");
    
    fs::create_dir_all(&data_dir).expect("Failed to create data directory");
    
    let db_path = data_dir.join("invio.db");
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());
    
    let pool = SqlitePool::connect(&db_url).await?;
    
    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;
    
    Ok(pool)
}
