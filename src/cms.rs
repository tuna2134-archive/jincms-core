use crate::AppState;
use actix_web::{post, web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct ArticleData {
    slug: String,
    title: String,
    description: String,
    author: String,
    body: String,
}

#[post("/articles")]
pub async fn create_article(
    app_state: web::Data<AppState>,
    article_data: web::Json<ArticleData>,
) -> impl Responder {
    let _pool = app_state.pool.lock().unwrap();
    sqlx::query!(
        "INSERT INTO Article VALUES (?, ?, ?, ?, ?, ?)",
        "test",
        article_data.slug,
        article_data.title,
        article_data.description,
        article_data.author,
        article_data.body,
    );
    HttpResponse::Ok().body("Created")
}
