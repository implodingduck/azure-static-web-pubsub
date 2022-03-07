output "swa_api_token" {
    sensitive = true
    value = azurerm_static_site.swa.api_key
}

output "swa_default_host_name" {
    value = azurerm_static_site.swa.default_host_name
}