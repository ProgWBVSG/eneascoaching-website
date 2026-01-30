# Script para configurar y subir EneasCoaching a GitHub
# IMPORTANTE: Ejecuta este script en una NUEVA terminal PowerShell

Write-Host "=== Configuración de Git para EneasCoaching ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que Git está instalado
Write-Host "1. Verificando instalación de Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "   ✓ Git instalado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Git no está disponible. Por favor:" -ForegroundColor Red
    Write-Host "     - Cierra esta terminal completamente" -ForegroundColor Red
    Write-Host "     - Abre una NUEVA terminal PowerShell" -ForegroundColor Red
    Write-Host "     - Vuelve a ejecutar este script" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "2. Configurando usuario de Git..." -ForegroundColor Yellow

# Solicitar información del usuario
$userName = Read-Host "   Ingresa tu nombre completo para Git"
$userEmail = Read-Host "   Ingresa tu email"

git config --global user.name "$userName"
git config --global user.email "$userEmail"
Write-Host "   ✓ Usuario configurado" -ForegroundColor Green

Write-Host ""
Write-Host "3. Inicializando repositorio local..." -ForegroundColor Yellow
git init
Write-Host "   ✓ Repositorio inicializado" -ForegroundColor Green

Write-Host ""
Write-Host "4. Agregando archivos al repositorio..." -ForegroundColor Yellow
git add .
Write-Host "   ✓ Archivos agregados" -ForegroundColor Green

Write-Host ""
Write-Host "5. Creando primer commit..." -ForegroundColor Yellow
git commit -m "Initial commit: EneasCoaching website"
Write-Host "   ✓ Commit creado" -ForegroundColor Green

Write-Host ""
Write-Host "6. Configurando rama principal como 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "   ✓ Rama configurada" -ForegroundColor Green

Write-Host ""
Write-Host "=== SIGUIENTE PASO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora necesitas crear el repositorio en GitHub:" -ForegroundColor Yellow
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repositorio: eneascoaching-website" -ForegroundColor White
Write-Host "3. Descripción: Sitio web profesional de EneasCoaching" -ForegroundColor White
Write-Host "4. Público o Privado (tu elección)" -ForegroundColor White
Write-Host "5. NO marques 'Add README', 'Add .gitignore', ni 'Choose license'" -ForegroundColor White
Write-Host "6. Haz clic en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Una vez creado, ejecuta el script 'upload_to_github.ps1'" -ForegroundColor Yellow
Write-Host ""
pause
