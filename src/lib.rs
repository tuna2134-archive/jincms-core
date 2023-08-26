use sqlx::MySqlPool;
use std::sync::Mutex;

pub mod cms;

pub struct AppState {
    pub pool: Mutex<MySqlPool>,
}