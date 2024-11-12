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

resource "google_project_iam_custom_role" "github_actions" {
  role_id = "GithubActions"
  stage   = "GA"
  title   = "Github Actions"
  permissions = [
    "artifactregistry.repositories.get",
    "artifactregistry.repositories.uploadArtifacts",
    "cloudbuild.builds.create",
    "cloudbuild.builds.get",
    "iam.serviceAccounts.actAs",
    "run.operations.get",
    "run.services.create",
    "run.services.get",
    "run.services.getIamPolicy",
    "run.services.setIamPolicy",
    "run.services.update",
    "serviceusage.services.get",
    "storage.buckets.get",
    "storage.buckets.list",
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.getIamPolicy",
    "storage.objects.list",
    "storage.objects.overrideUnlockedRetention",
    "storage.objects.restore",
    "storage.objects.setIamPolicy",
    "storage.objects.setRetention",
    "storage.objects.update",
  ]
}
