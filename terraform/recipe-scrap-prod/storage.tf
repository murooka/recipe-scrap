resource "google_storage_bucket" "vision_assets" {
  name                        = "recipe-scrap-prod-vision-assets"
  location                    = local.region
  storage_class               = "STANDARD"
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  force_destroy               = false
}
