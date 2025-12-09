use crate::db::DbPool;
use crate::models::{Transaction, NewTransaction, DailyStats, TransactionFilter, User, NewUser, UpdateUser, UserActivity};
use tauri::State;
use chrono::Utc;

#[tauri::command]
pub async fn get_daily_budget(pool: State<'_, DbPool>) -> Result<f64, String> {
    // Get today's budget (this could be configurable)
    // For now, returning a fixed value
    Ok(2000.0)
}

#[tauri::command]
pub async fn get_daily_expenses(pool: State<'_, DbPool>) -> Result<f64, String> {
    let today = Utc::now().format("%Y-%m-%d").to_string();
    
    let result = sqlx::query_scalar::<_, f64>(
        "SELECT COALESCE(SUM(amount), 0) FROM transactions 
         WHERE transaction_type = 'expense' 
         AND DATE(created_at) = DATE(?)"
    )
    .bind(&today)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(result)
}

#[tauri::command]
pub async fn get_today_transactions(pool: State<'_, DbPool>) -> Result<Vec<Transaction>, String> {
    let today = Utc::now().format("%Y-%m-%d").to_string();
    
    let transactions = sqlx::query_as::<_, Transaction>(
        "SELECT * FROM transactions 
         WHERE DATE(created_at) = DATE(?)
         ORDER BY created_at DESC"
    )
    .bind(&today)
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(transactions)
}

#[tauri::command]
pub async fn add_transaction(
    pool: State<'_, DbPool>,
    transaction: NewTransaction,
) -> Result<Transaction, String> {
    let now = Utc::now().to_rfc3339();
    
    let result = sqlx::query_as::<_, Transaction>(
        "INSERT INTO transactions 
         (person_name, person_avatar, category, amount, transaction_type, reason, responsible_person, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING *"
    )
    .bind(&transaction.person_name)
    .bind(&transaction.person_avatar)
    .bind(&transaction.category)
    .bind(transaction.amount)
    .bind(&transaction.transaction_type)
    .bind(&transaction.reason)
    .bind(&transaction.responsible_person)
    .bind(&now)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(result)
}

#[tauri::command]
pub async fn search_transactions(
    pool: State<'_, DbPool>,
    filter: TransactionFilter,
) -> Result<Vec<Transaction>, String> {
    let mut query = String::from("SELECT * FROM transactions WHERE 1=1");
    
    if let Some(search) = &filter.search_query {
        if !search.is_empty() {
            query.push_str(&format!(" AND (person_name LIKE '%{}%' OR reason LIKE '%{}%')", search, search));
        }
    }
    
    if let Some(filter_type) = &filter.filter_type {
        match filter_type.as_str() {
            "day" => {
                if let Some(date) = &filter.date {
                    query.push_str(&format!(" AND DATE(created_at) = DATE('{}')", date));
                }
            },
            "month" => {
                if let Some(date) = &filter.date {
                    query.push_str(&format!(" AND strftime('%Y-%m', created_at) = strftime('%Y-%m', '{}')", date));
                }
            },
            _ => {}
        }
    }
    
    query.push_str(" ORDER BY created_at DESC");
    
    let transactions = sqlx::query_as::<_, Transaction>(&query)
        .fetch_all(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(transactions)
}

#[tauri::command]
pub async fn export_transactions_pdf(
    pool: State<'_, DbPool>,
    filter: TransactionFilter,
) -> Result<String, String> {
    // This is a placeholder for PDF export functionality
    // You would need to implement actual PDF generation here
    Ok("PDF export feature coming soon".to_string())
}

// User Management Commands

#[tauri::command]
pub async fn get_all_users(pool: State<'_, DbPool>) -> Result<Vec<User>, String> {
    let users = sqlx::query_as::<_, User>(
        "SELECT * FROM users ORDER BY created_at DESC"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(users)
}

#[tauri::command]
pub async fn add_user(
    pool: State<'_, DbPool>,
    user: NewUser,
) -> Result<User, String> {
    let now = Utc::now().to_rfc3339();
    
    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users 
         (username, full_name, role, password, department, created_at)
         VALUES (?, ?, ?, ?, ?, ?)
         RETURNING *"
    )
    .bind(&user.username)
    .bind(&user.full_name)
    .bind(&user.role)
    .bind(&user.password)
    .bind(&user.department)
    .bind(&now)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(result)
}

#[tauri::command]
pub async fn update_user(
    pool: State<'_, DbPool>,
    id: i64,
    user: UpdateUser,
) -> Result<User, String> {
    let mut query = String::from("UPDATE users SET ");
    let mut updates = Vec::new();
    
    if let Some(full_name) = &user.full_name {
        updates.push(format!("full_name = '{}'", full_name));
    }
    if let Some(role) = &user.role {
        updates.push(format!("role = '{}'", role));
    }
    if let Some(status) = &user.status {
        updates.push(format!("status = '{}'", status));
    }
    if let Some(department) = &user.department {
        updates.push(format!("department = '{}'", department));
    }
    if let Some(password) = &user.password {
        updates.push(format!("password = '{}'", password));
    }
    
    if updates.is_empty() {
        return Err("No fields to update".to_string());
    }
    
    query.push_str(&updates.join(", "));
    query.push_str(&format!(" WHERE id = {} RETURNING *", id));
    
    let result = sqlx::query_as::<_, User>(&query)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(result)
}

#[tauri::command]
pub async fn delete_user(
    pool: State<'_, DbPool>,
    id: i64,
) -> Result<(), String> {
    sqlx::query("DELETE FROM users WHERE id = ?")
        .bind(id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub async fn get_user_activity(pool: State<'_, DbPool>) -> Result<Vec<UserActivity>, String> {
    let activities = sqlx::query_as::<_, UserActivity>(
        "SELECT * FROM user_activity ORDER BY created_at DESC LIMIT 20"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(activities)
}
