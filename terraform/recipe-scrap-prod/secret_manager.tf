resource "google_secret_manager_secret" "google_oauth2_client_secret" {
  secret_id = "google-oauth2-client-secret"

  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret" "database_url" {
  secret_id = "database-url"

  replication {
    auto {
    }
  }
}