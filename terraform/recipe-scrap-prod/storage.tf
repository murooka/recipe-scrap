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

resource "google_storage_bucket_iam_binding" "storage_file_viewer" {
  bucket  = google_storage_bucket.user_assets.name
  role    = google_project_iam_custom_role.storage_file_viewer.id
  members = ["allUsers"]
}
