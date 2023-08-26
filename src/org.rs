use actix_web::{
    Responder, HttpResponse, web, post
};

use crate::AppState;

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
) -> impl Responder {
    let pool = app_state.pool.lock().unwrap();
    sqlx::query!(
        "INSERT INTO Organization VALUES (?, ?)",
        organization_data.name, organization_data.id,
    ).execute(&pool).await.unwrap();
    for user in organization_data.users.iter() {
        sqlx::query!(
            "INSERT INTO OrganizationUser VALUES (?, ?)",
            organization_data.id, user,
        ).execute(&pool).await.unwrap();
    }
    HttpResponse::Ok().body("Created")
}