use actix_web::{
    Responder, HttpResponse, web, post, HttpRequest,
};
use serde::Deserialize;

use crate::AppState;
use crate::user::verify_token;

#[derive(Deserialize)]
pub struct OrganizationData {
    name: String,
    id: String,
    users: Vec<String>,
}

#[post("/organizations")]
pub async fn create_organization(
    app_state: web::Data<AppState>,
    organization_data: web::Json<OrganizationData>,
    req: HttpRequest,
) -> impl Responder {
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
    sqlx::query!(
        "INSERT INTO Organization VALUES (?, ?, ?)",
        organization_data.id, organization_data.name, user.id
    ).execute(&*pool).await.unwrap();
    for user in organization_data.users.iter() {
        sqlx::query!(
            "INSERT INTO OrganizationMember VALUES (?, ?, ?)",
            organization_data.id, user, "owner"
        ).execute(&*pool).await.unwrap();
    }
    HttpResponse::Ok().body("Created")
}