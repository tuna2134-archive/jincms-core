use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

use crate::user::verify_token;
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
        organization_data.id,
        organization_data.name,
        user.id
    )
    .execute(&*pool)
    .await
    .unwrap();
    for user in organization_data.users.iter() {
        sqlx::query!(
            "INSERT INTO OrganizationMember VALUES (?, ?, ?)",
            organization_data.id,
            user,
            "owner"
        )
        .execute(&*pool)
        .await
        .unwrap();
    }
    HttpResponse::Ok().body("Created")
}

#[derive(Deserialize, Serialize)]
pub struct OrganizationDataResponse {
    name: String,
    id: String,
}

#[get("/organizations")]
pub async fn get_organizations(req: HttpRequest, app_state: web::Data<AppState>) -> impl Responder {
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
    let organizations = sqlx::query!(
        "SELECT * FROM Organization WHERE id IN (SELECT OrgId FROM OrganizationMember WHERE userId = ?)",
        user.id
    ).fetch_all(&*pool).await.unwrap();
    let orgs: Vec<OrganizationDataResponse> = organizations
        .iter()
        .map(|org| OrganizationDataResponse {
            name: org.name.clone().unwrap(),
            id: org.id.clone(),
        })
        .collect();
    HttpResponse::Ok().json(orgs)
}
