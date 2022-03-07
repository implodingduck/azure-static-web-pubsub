terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.98.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "=3.1.0"
    }
  }
  backend "azurerm" {

  }
}

provider "azurerm" {
  features {}

  subscription_id = var.subscription_id
}

locals {
  func_name = "func${random_string.unique.result}"
  loc_for_naming = lower(replace(var.location, " ", ""))
  gh_repo = replace(var.gh_repo, "implodingduck/", "")
  tags = {
    "managed_by" = "terraform"
    "repo"       = local.gh_repo
  }
}

resource "random_string" "unique" {
  length  = 8
  special = false
  upper   = false
}


data "azurerm_client_config" "current" {}

data "azurerm_log_analytics_workspace" "default" {
  name                = "DefaultWorkspace-${data.azurerm_client_config.current.subscription_id}-EUS"
  resource_group_name = "DefaultResourceGroup-EUS"
} 

data "azurerm_network_security_group" "basic" {
    name                = "basic"
    resource_group_name = "rg-network-eastus"
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${local.gh_repo}-${random_string.unique.result}-${local.loc_for_naming}"
  location = var.location
  tags = local.tags
}

resource "azurerm_static_site" "swa" {
  name                = "azurestaticwebpubsub"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags = local.tags
}

resource "azurerm_web_pubsub" "pubsub" {
  name                = "azurestaticwebpubsub"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku      = "Free_F1"
  capacity = 1

  live_trace {
    enabled                   = true
    messaging_logs_enabled    = true
    connectivity_logs_enabled = true
  }

  identity {
    type = "SystemAssigned"
  }
}