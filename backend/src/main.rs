use axum::{routing::post, routing::get, Router, Json, extract::Form, response::IntoResponse};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};

#[derive(Deserialize)]
struct MathQuery { expression: String }

#[derive(Serialize)]
struct MathResult { expression: String, result: String, steps: Vec<String>, latex: String }

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({"status": "healthy", "service": "Wolfram Solver"}))
}

async fn solve_math(Form(q): Form<MathQuery>) -> impl IntoResponse {
    let result = MathResult {
        expression: q.expression.clone(),
        result: "42".to_string(),
        steps: vec!["Step 1: Simplify".into(), "Step 2: Solve".into()],
        latex: format!("${}$", q.expression),
    };
    Json(serde_json::json!({"success": true, "data": result}))
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/", get(|| async { Json(serde_json::json!({"service": "Wolfram Solver"})) }))
        .route("/health", get(health_check))
        .route("/solve", post(solve_math))
        .layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
