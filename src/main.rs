use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use env_logger::Env;
use sqlx::MySqlPool;

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
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();
        App::new()
            .service(jincms_core::user::oauth_url)
            .service(jincms_core::user::callback)
            .service(jincms_core::user::get_me)
            .service(jincms_core::org::create_organization)
            .service(jincms_core::cms::create_article)
            .service(jincms_core::cms::get_article)
            .service(jincms_core::cms::get_articles)
            .service(jincms_core::cms::delete_article)
            .app_data(app_state.clone())
            .wrap(cors)
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
