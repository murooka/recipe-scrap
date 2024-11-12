resource "google_service_account" "cloud_run_web" {
  account_id   = "cloud-run-web"
  description  = "Cloud Run の web service 用のサービスアカウントです"
  display_name = "cloud-run-web"
}

resource "google_service_account" "github_actions" {
  account_id   = "github-actions"
  display_name = "GitHub Actions"
}
