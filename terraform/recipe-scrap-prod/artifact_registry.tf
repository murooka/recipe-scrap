resource "google_artifact_registry_repository" "cloud_run" {
  location      = "asia-northeast1"
  repository_id = "cloud-run"
  description   = "Cloud Run images"
  format        = "DOCKER"

  cleanup_policy_dry_run = false
  cleanup_policies {
    id     = "30日以上前のイメージを削除"
    action = "DELETE"
    condition {
      older_than = "2592000s"
    }
  }
  cleanup_policies {
    id     = "最新のイメージは保持"
    action = "KEEP"
    most_recent_versions {
      keep_count = 3
    }
  }
}
