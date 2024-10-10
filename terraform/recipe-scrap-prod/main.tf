terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.44.1"
    }
  }
}

provider "google" {
  project = "recipe-scrap-prod"
  region  = "asia-northeast1"
}

terraform {
  backend "gcs" {
    bucket = "recipe-scrap-prod-terraform-state"
    prefix = "terraform/state"
  }
}
