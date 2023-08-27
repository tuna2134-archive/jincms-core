use crate::AppState;
use crate::user::verify_token;
use actix_web::{post, web, HttpResponse, Responder, HttpRequest};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct ArticleData {
    slug: String,
    title: String,
    description: String,
    author: String,
    body: String,
}

#[derive(Deserialize)]
pub struct CreateArticlePath {
    org_id: String,
}

#[post("/articles")]
pub async fn create_article(
    app_state: web::Data<AppState>,
    article_data: web::Json<ArticleData>,
    path: web::Path<CreateArticlePath>,
    req: HttpRequest,
) -> impl Responder {
    println!("RUnn");
    let token = {
        let headers = req.headers();
        let authorization = headers.get("Authorization").unwrap();
        let token = authorization.to_str().unwrap();
        // split token
        let token = token.split(" ").collect::<Vec<&str>>();
        token[1]
    };
    let user = verify_token(token.to_string()).unwrap();
    let pool = app_state.pool.lock().unwrap();
    let check = {
        let data = sqlx::query!(
            "SELECT * FROM OrganizationMember WHERE orgId = ? AND userId = ?",
            path.org_id, user.id
        ).fetch_optional(&*pool).await.unwrap();
        data.is_some()
    };
    if !check {
        return HttpResponse::Forbidden().body("Forbidden");
    }
    sqlx::query!(
        "INSERT INTO Article VALUES (?, ?, ?, ?, ?, ?)",
        path.org_id,
        article_data.slug,
        article_data.title,
        article_data.description,
        article_data.author,
        article_data.body,
    ).execute(&*pool).await.unwrap();
    HttpResponse::Ok().body("Created")
}