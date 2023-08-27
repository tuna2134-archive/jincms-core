use actix_web::{web, App, HttpServer, middleware::Logger};
use sqlx::MySqlPool;
use env_logger::Env;

use jincms_core::AppState;
use std::env;
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("info"));
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
            .service(jincms_core::user::oauth_url)
            .service(jincms_core::user::callback)
            .service(jincms_core::org::create_organization)
            .service(jincms_core::cms::create_article)
            .service(jincms_core::cms::get_article)
            .service(jincms_core::cms::get_articles)
            .app_data(app_state.clone())
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
