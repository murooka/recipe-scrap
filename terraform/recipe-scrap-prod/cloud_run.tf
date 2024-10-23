resource "google_cloud_run_v2_service" "web" {
  name     = "web"
  location = "asia-northeast1"
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    service_account = google_service_account.cloud_run_web.email
    containers {
      image = "asia-northeast1-docker.pkg.dev/recipe-scrap-prod/cloud-run/web"
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }
      env {
        name  = "GOOGLE_OAUTH2_CLIENT_ID"
        value = "812243067215-78ml2b001pp0kis9dva1qaansj8e24sj.apps.googleusercontent.com"
      }
      env {
        name = "GOOGLE_OAUTH2_CLIENT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.google_oauth2_client_secret.id
            version = "latest"
          }
        }
      }
      env {
        name  = "GOOGLE_OAUTH2_CALLBACK_URL"
        value = "https://web-812243067215.asia-northeast1.run.app/auth/google/callback"
      }
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.id
            version = "latest"
          }
        }
      }
      env {
        name = "OPENAI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.openai_api_key.id
            version = "latest"
          }
        }
      }
      env {
        name = "YOUTUBE_DATA_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.youtube_data_api_key.id
            version = "latest"
          }
        }
      }
      env {
        name  = "GCS_PUBLIC_BUCKET_NAME"
        value = "recipe-scrap-prod-user-assets"
      }
    }
  }

  timeouts {}

  lifecycle {
    ignore_changes = [client, client_version]
  }
}
