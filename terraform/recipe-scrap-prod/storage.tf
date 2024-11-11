resource "google_storage_bucket" "vision_assets" {
  name                        = "recipe-scrap-prod-vision-assets"
  location                    = local.region
  storage_class               = "STANDARD"
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  force_destroy               = false
}

resource "google_storage_bucket" "user_assets" {
  name                        = "recipe-scrap-prod-user-assets"
  location                    = local.region
  storage_class               = "STANDARD"
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  force_destroy               = false
}

resource "google_storage_bucket_iam_binding" "user_assets__storage_file_viewer" {
  bucket  = google_storage_bucket.user_assets.name
  role    = google_project_iam_custom_role.storage_file_viewer.id
  members = ["allUsers"]
}

resource "google_storage_bucket" "assets" {
  name                        = "a.rscrap.site"
  location                    = local.region
  storage_class               = "STANDARD"
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  force_destroy               = false
}

resource "google_storage_bucket_iam_binding" "assets__storage_file_viewer" {
  bucket  = google_storage_bucket.assets.name
  role    = google_project_iam_custom_role.storage_file_viewer.id
  members = ["allUsers"]
}

### for local

resource "google_storage_bucket" "local_user_assets" {
  name                        = "recipe-scrap-local-user-assets"
  location                    = local.region
  storage_class               = "STANDARD"
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  force_destroy               = false
}

resource "google_storage_bucket_iam_binding" "local_user_assets_file_viewer" {
  bucket  = google_storage_bucket.local_user_assets.name
  role    = google_project_iam_custom_role.storage_file_viewer.id
  members = ["allUsers"]
}
