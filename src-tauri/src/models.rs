use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Transaction {
    pub id: i64,
    pub person_name: String,
    pub person_avatar: Option<String>,
    pub category: String,
    pub amount: f64,
    pub transaction_type: String, // "income" or "expense"
    pub reason: String,
    pub responsible_person: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewTransaction {
    pub person_name: String,
    pub person_avatar: Option<String>,
    pub category: String,
    pub amount: f64,
    pub transaction_type: String,
    pub reason: String,
    pub responsible_person: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyStats {
    pub total_budget: f64,
    pub total_expenses: f64,
    pub spending_percentage: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionFilter {
    pub search_query: Option<String>,
    pub filter_type: Option<String>, // "day", "month", "person", "category"
    pub date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub full_name: String,
    pub role: String,
    pub status: String,
    pub avatar: Option<String>,
    pub password: String,
    pub department: Option<String>,
    pub created_at: String,
    pub last_login: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub full_name: String,
    pub role: String,
    pub password: String,
    pub department: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateUser {
    pub full_name: Option<String>,
    pub role: Option<String>,
    pub status: Option<String>,
    pub department: Option<String>,
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct UserActivity {
    pub id: i64,
    pub username: String,
    pub activity: String,
    pub created_at: String,
}
