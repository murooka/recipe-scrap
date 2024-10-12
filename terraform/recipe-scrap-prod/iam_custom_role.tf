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

resource "google_project_iam_custom_role" "storage_file_viewer" {
  role_id     = "StorageFileViewer"
  stage       = "GA"
  title       = "Storage ファイル閲覧者"
  description = "Storage ファイルのみ閲覧のみ可能なロール"
  permissions = ["storage.objects.get"]
}
