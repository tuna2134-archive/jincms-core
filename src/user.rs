use actix_web::{get, web, Responder};
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use url::Url;

use crate::AppState;
use std::env;

#[derive(Deserialize)]
pub struct CallbackData {
    code: String,
}

#[derive(Deserialize, Debug, Serialize)]
pub struct User {
    id: String,
    name: String,
    email: String,
    exp: i64,
}

fn create_token(user_id: String, user_name: String, email: String) -> String {
    let mut header = Header::default();
    header.alg = Algorithm::HS512;
    header.typ = Some("JWT".to_string());
    let now = chrono::Utc::now();
    let exp = now.timestamp() + 60 * 60 * 24;
    let claims = User {
        id: user_id,
        name: user_name,
        email: email,
        exp: exp,
    };
    let key = env::var("JWT_SECRET").unwrap();
    let token = encode(&header, &claims, &EncodingKey::from_secret(key.as_ref())).unwrap();
    token
}

fn create_oauth_url() -> String {
    let mut url = Url::parse("https://github.com/login/oauth/authorize").unwrap();
    let client_id = format!("client_id={}", env::var("GITHUB_CLIENT_ID").unwrap());
    url.set_query(Some(
        &(client_id
            + "&"
            + "redirect_uri=https://organic-carnival-95xr4qj69qf7g4j-8080.app.github.dev/users/callback"
            + "&"
            + "scope=user:email"),
    ));
    url.to_string()
}

#[get("/users/callback")]
pub async fn callback(
    data: web::Query<CallbackData>,
    app_state: web::Data<AppState>,
) -> impl Responder {
    let client = Client::new();
    let code = data.code.clone();
    let req_data = format!("client_id={}", env::var("GITHUB_CLIENT_ID").unwrap())
        + "&"
        + format!("client_secret={}", env::var("GITHUB_CLIENT_SECRET").unwrap()).as_str()
        + "&"
        + format!("code={}", code).as_str()
        + "&"
        + "redirect_uri=https://organic-carnival-95xr4qj69qf7g4j-8080.app.github.dev/users/callback";
    println!("{}", req_data);
    let data = client
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .body(req_data)
        .send()
        .await
        .unwrap()
        .json::<serde_json::Value>()
        .await
        .unwrap();
    println!("{:?}", data);
    let token = data["access_token"].as_str().unwrap();
    let user = client
        .post("https://api.github.com/user")
        .header("Accept", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap()
        .json::<serde_json::Value>()
        .await
        .unwrap();
    let user_id = user["id"].to_string();
    let pool = app_state.pool.lock().unwrap();
    let data = sqlx::query!("SELECT * FROM User WHERE id = ?", user_id)
        .fetch_optional(&*pool)
        .await
        .unwrap();
    if data.is_none() {
        sqlx::query!(
            "INSERT INTO User VALUES (?, ?, ?)",
            user_id,
            user["name"].to_string(),
            user["email"].to_string(),
        )
        .execute(&*pool)
        .await
        .unwrap();
    }
    // create jwt token
    let token = create_token(user_id, user["name"].to_string(), user["email"].to_string());
    let responde_data = serde_json::json!({
        "token": token,
    });
    web::Json(responde_data)
}

#[get("/users/oauth_url")]
pub async fn oauth_url() -> impl Responder {
    let url = create_oauth_url();
    web::Json(serde_json::json!({
        "url": url,
    }))
}
