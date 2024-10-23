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

resource "google_secret_manager_secret" "openai_api_key" {
  secret_id = "openai-api-key"

  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret" "youtube_data_api_key" {
  secret_id = "youtube-data-api-key"

  replication {
    auto {
    }
  }
}
