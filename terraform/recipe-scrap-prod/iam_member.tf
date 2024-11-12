resource "google_project_iam_member" "cloud_run_web__cloud_run_web_runner" {
  project = local.project_id
  member  = google_service_account.cloud_run_web.member
  role    = google_project_iam_custom_role.cloud_run_web_runner.id
}

resource "google_project_iam_member" "cloud_run_web__editor" {
  project = local.project_id
  member  = google_service_account.cloud_run_web.member
  role    = "roles/editor"
}

resource "google_project_iam_member" "cloud_run_web__secretmanager_secretaccessor" {
  project = local.project_id
  member  = google_service_account.cloud_run_web.member
  role    = "roles/secretmanager.secretAccessor"
}

resource "google_project_iam_binding" "github_actions__github_actions" {
  project = local.project_id
  role    = google_project_iam_custom_role.github_actions.id
  members = [
    google_service_account.github_actions.member
  ]
}
