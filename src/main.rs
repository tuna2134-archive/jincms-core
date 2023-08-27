use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::MySqlPool;

use jincms_core::AppState;
use std::env;
use std::sync::Mutex;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .unwrap();
    sqlx::migrate!().run(&pool).await.unwrap();
    let app_state = AppState {
        pool: Mutex::new(pool),
    };
    let app_state = web::Data::new(app_state);
    HttpServer::new(move || {
        App::new()
            .service(hello)
            .service(echo)
            .service(jincms_core::cms::create_article)
            .service(jincms_core::user::oauth_url)
            .service(jincms_core::user::callback)
            .service(jincms_core::org::create_organization)
            .route("/hey", web::get().to(manual_hello))
            .app_data(app_state.clone())
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
