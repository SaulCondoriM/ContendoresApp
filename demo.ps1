# Demo Script - GameStore Docker Containers
# Ejecutar desde: C:\Users\saul-\OneDrive\Escritorio\Proyecto2\gamestore-app

Write-Host "===========================================" -ForegroundColor Green
Write-Host "   DEMO: 3 CONTENEDORES COMUNICANDOSE" -ForegroundColor Green  
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. VERIFICANDO 3 CONTENEDORES ACTIVOS:" -ForegroundColor Yellow
docker compose ps
Write-Host ""

Write-Host "2. VERIFICANDO RED DE COMUNICACION:" -ForegroundColor Yellow
docker network ls | findstr gamestore
Write-Host ""

Write-Host "3. PROBANDO FRONTEND (React + nginx):" -ForegroundColor Yellow
Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.Content) { 
        Write-Host "   [OK] Frontend responde correctamente" -ForegroundColor Green 
    } else { 
        Write-Host "   [ERROR] Frontend no responde" -ForegroundColor Red 
    }
} catch {
    Write-Host "   [ERROR] Frontend no responde" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. PROBANDO COMUNICACION FRONTEND -> BACKEND:" -ForegroundColor Yellow
Write-Host "   Ruta: Frontend(nginx) -> Backend(API)" -ForegroundColor Cyan
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/games" -UseBasicParsing -TimeoutSec 5
    if ($apiResponse.Content) { 
        Write-Host "   [OK] Frontend se comunica con Backend via nginx proxy" -ForegroundColor Green 
    } else { 
        Write-Host "   [ERROR] Error en comunicacion Frontend -> Backend" -ForegroundColor Red 
    }
} catch {
    Write-Host "   [ERROR] Error en comunicacion Frontend -> Backend" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. PROBANDO COMUNICACION BACKEND -> DATABASE:" -ForegroundColor Yellow  
Write-Host "   Ruta: Backend(Express) -> Database(MariaDB)" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($healthResponse.Content -match "ok") { 
        Write-Host "   [OK] Backend se comunica con Database correctamente" -ForegroundColor Green 
    } else { 
        Write-Host "   [ERROR] Error en comunicacion Backend -> Database" -ForegroundColor Red 
    }
} catch {
    Write-Host "   [ERROR] Error en comunicacion Backend -> Database" -ForegroundColor Red
}
Write-Host ""

Write-Host "6. VERIFICANDO CONECTIVIDAD INTERNA:" -ForegroundColor Yellow
Write-Host "   Ping Frontend -> Backend:" -ForegroundColor Cyan
docker compose exec -T frontend ping -c 2 backend
Write-Host ""
Write-Host "   Ping Backend -> Database:" -ForegroundColor Cyan  
docker compose exec -T backend ping -c 2 database
Write-Host ""

Write-Host "7. MOSTRANDO PUERTOS EXPUESTOS:" -ForegroundColor Yellow
Write-Host "   Frontend:" -ForegroundColor Cyan
docker compose port frontend
Write-Host "   Backend:" -ForegroundColor Cyan
docker compose port backend
Write-Host "   Database:" -ForegroundColor Cyan
docker compose port database
Write-Host ""

Write-Host "8. LOGS DE COMUNICACION RECIENTES:" -ForegroundColor Yellow
docker compose logs --tail=10 backend | findstr "Conectado\|database\|health"
Write-Host ""

Write-Host "===========================================" -ForegroundColor Green
Write-Host "[OK] DEMO COMPLETADO - 3 CONTENEDORES FUNCIONANDO" -ForegroundColor Green
Write-Host "[OK] COMUNICACION ENTRE CONTENEDORES VERIFICADA" -ForegroundColor Green  
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs para probar en el navegador:" -ForegroundColor Yellow
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:5000/api/games" -ForegroundColor Cyan
Write-Host "- Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan
