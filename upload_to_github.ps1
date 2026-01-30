# Script para subir el proyecto a GitHub
# IMPORTANTE: Ejecuta este script DESPUÉS de crear el repositorio en GitHub

Write-Host "=== Subiendo EneasCoaching a GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Solicitar el nombre de usuario de GitHub
Write-Host "Ingresa tu nombre de usuario de GitHub" -ForegroundColor Yellow
Write-Host "(Ejemplo: ProgWBVSG)" -ForegroundColor Gray
$githubUser = Read-Host "Usuario"

if ([string]::IsNullOrWhiteSpace($githubUser)) {
    $githubUser = "ProgWBVSG"
    Write-Host "Usando usuario por defecto: $githubUser" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "1. Conectando con el repositorio remoto..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$githubUser/eneascoaching-website.git"
Write-Host "   URL: $remoteUrl" -ForegroundColor Gray

try {
    git remote add origin $remoteUrl
    Write-Host "   ✓ Repositorio remoto agregado" -ForegroundColor Green
} catch {
    Write-Host "   ℹ El remoto 'origin' ya existe, actualizando URL..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
    Write-Host "   ✓ URL actualizada" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Subiendo archivos a GitHub..." -ForegroundColor Yellow
Write-Host "   (Esto puede tardar unos momentos)" -ForegroundColor Gray

try {
    git push -u origin main
    Write-Host ""
    Write-Host "   ✓ ¡Proyecto subido exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== ¡ÉXITO! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu proyecto está ahora en GitHub:" -ForegroundColor Cyan
    Write-Host "https://github.com/$githubUser/eneascoaching-website" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "   ✗ Error al subir archivos" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "1. Verifica que creaste el repositorio en GitHub" -ForegroundColor White
    Write-Host "2. Asegúrate de que el nombre de usuario es correcto" -ForegroundColor White
    Write-Host "3. Puede que necesites autenticarte con GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "Para autenticarte, GitHub te pedirá tu usuario y contraseña" -ForegroundColor Gray
    Write-Host "(o un Personal Access Token)" -ForegroundColor Gray
    Write-Host ""
}

pause
