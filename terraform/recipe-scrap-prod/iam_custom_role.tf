resource "google_project_iam_custom_role" "cloud_run_web_runner" {
  role_id     = "CloudRunWebRunner"
  stage       = "GA"
  title       = "Cloud Run web runner"
  description = "Cloud Run の web service を実行するロールです"
  permissions = [
    "iam.serviceAccounts.signBlob",
    "resourcemanager.projects.get",
    "storage.managedFolders.get",
    "storage.managedFolders.list",
    "storage.objects.get",
    "storage.objects.list"
  ]
}
