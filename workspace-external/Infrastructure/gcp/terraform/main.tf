# Google Cloud Platform Basic Terraform Configuration for Rigger Platform
# Basic deployment without SQL initially

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "tiation-enterprise-rigger-platform-terraform-state"
    prefix = "terraform/state"
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "domain" {
  description = "The domain name for the application"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Enable required APIs (excluding SQL for now)
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com"
  ])
  
  service = each.key
  project = var.project_id
  
  disable_on_destroy = false
}

# VPC Network for private connectivity
resource "google_compute_network" "rigger_network" {
  name                    = "rigger-platform-network"
  auto_create_subnetworks = false
  project                 = var.project_id
  
  depends_on = [google_project_service.apis]
}

resource "google_compute_subnetwork" "rigger_subnet" {
  name          = "rigger-platform-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.rigger_network.id
  project       = var.project_id
}

# VPC Connector for Cloud Run to access private resources
resource "google_vpc_access_connector" "rigger_connector" {
  name          = "rigger-platform-connector"
  region        = var.region
  network       = google_compute_network.rigger_network.name
  ip_cidr_range = "10.1.0.0/28"
  project       = var.project_id
  
  depends_on = [google_project_service.apis]
}

# Redis instance for caching
resource "google_redis_instance" "rigger_cache" {
  name           = "rigger-platform-cache"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region
  project        = var.project_id
  
  authorized_network = google_compute_network.rigger_network.id
  redis_version      = "REDIS_7_0"
  
  depends_on = [google_project_service.apis]
}

# Cloud Storage bucket for file uploads
resource "google_storage_bucket" "rigger_uploads" {
  name          = "${var.project_id}-rigger-uploads"
  location      = var.region
  project       = var.project_id
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

# Secret Manager secrets
resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jwt-secret"
  project   = var.project_id
  
  replication {
    auto {}
  }
  
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

# Cloud Run API Service
resource "google_cloud_run_v2_service" "rigger_api" {
  name     = "rigger-platform-api"
  location = var.region
  project  = var.project_id
  
  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 10
    }
    
    vpc_access {
      connector = google_vpc_access_connector.rigger_connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
    
    containers {
      image = "gcr.io/${var.project_id}/rigger-platform-api:latest"
      
      ports {
        container_port = 3001
      }
      
      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }
      
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      
      env {
        name  = "REDIS_URL"
        value = "redis://${google_redis_instance.rigger_cache.host}:${google_redis_instance.rigger_cache.port}"
      }
      
      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }
    }
  }
  
  depends_on = [google_project_service.apis]
}

# Cloud Run Web Service
resource "google_cloud_run_v2_service" "rigger_web" {
  name     = "rigger-platform-web"
  location = var.region
  project  = var.project_id
  
  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
    
    containers {
      image = "gcr.io/${var.project_id}/rigger-platform-web:latest"
      
      ports {
        container_port = 3000
      }
      
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
      
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      
      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = google_cloud_run_v2_service.rigger_api.uri
      }
    }
  }
  
  depends_on = [google_project_service.apis]
}

# IAM policy to allow unauthenticated access
resource "google_cloud_run_service_iam_binding" "api_public" {
  location = google_cloud_run_v2_service.rigger_api.location
  service  = google_cloud_run_v2_service.rigger_api.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

resource "google_cloud_run_service_iam_binding" "web_public" {
  location = google_cloud_run_v2_service.rigger_web.location
  service  = google_cloud_run_v2_service.rigger_web.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

# Output values
output "api_url" {
  description = "URL of the API service"
  value       = google_cloud_run_v2_service.rigger_api.uri
}

output "web_url" {
  description = "URL of the web service"
  value       = google_cloud_run_v2_service.rigger_web.uri
}

output "redis_url" {
  description = "Redis connection URL"
  value       = "redis://${google_redis_instance.rigger_cache.host}:${google_redis_instance.rigger_cache.port}"
}