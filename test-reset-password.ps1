# Script de PowerShell para probar resetPasswordDefault
Write-Host "🧪 Probando método resetPasswordDefault..." -ForegroundColor Yellow
Write-Host "📧 Email: gpaz@dnsffaa.gub.uy" -ForegroundColor Cyan
Write-Host "🌐 URL: http://localhost:3001/api/auth/resetDefault" -ForegroundColor Cyan

try {
    $uri = "http://localhost:3001/api/auth/resetDefault"
    $body = @{
        email = "gpaz@dnsffaa.gub.uy"
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    Write-Host "🔄 Enviando petición..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Éxito!" -ForegroundColor Green
    Write-Host "📊 Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📄 Respuesta: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "   Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Respuesta del servidor: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🏁 Prueba completada." -ForegroundColor Yellow

