@echo off
REM Database setup script for Rockfall Prediction System (Windows)
REM This script sets up PostgreSQL with PostGIS and creates the database

echo 🗄️  Setting up Rockfall Prediction Database...

REM Configuration
set DB_NAME=rockfall_prediction
set DB_USER=rockfall_app
set DB_PASSWORD=rockfall_secure_pass_2024
set DB_HOST=localhost
set DB_PORT=5432
set POSTGRES_USER=postgres

REM Check if PostgreSQL is running
pg_isready -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not running. Please start PostgreSQL service first.
    echo    Windows: Start PostgreSQL service from Services or run "net start postgresql-x64-14"
    pause
    exit /b 1
)

echo ✅ PostgreSQL is running

REM Create database user
echo 📝 Creating database user...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASSWORD%'; ALTER USER %DB_USER% CREATEDB;" 2>nul || echo ⚠️  User might already exist, continuing...

REM Create database
echo 📝 Creating database...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;" 2>nul || echo ⚠️  Database might already exist, continuing...

REM Grant privileges
echo 📝 Granting privileges...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -c "GRANT ALL PRIVILEGES ON DATABASE %DB_NAME% TO %DB_USER%;"

REM Install PostGIS extension
echo 🗺️  Installing PostGIS extension...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -d %DB_NAME% -c "CREATE EXTENSION IF NOT EXISTS postgis; CREATE EXTENSION IF NOT EXISTS postgis_topology; CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

REM Grant PostGIS permissions
echo 📝 Granting PostGIS permissions...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -d %DB_NAME% -c "GRANT USAGE ON SCHEMA public TO %DB_USER%; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO %DB_USER%; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO %DB_USER%; GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO %DB_USER%;"

REM Create schema
echo 🏗️  Creating database schema...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f schema.sql

REM Insert sample data
echo 📊 Inserting sample data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f sample_data.sql

REM Grant final permissions
echo 🔐 Setting final permissions...
psql -h %DB_HOST% -p %DB_PORT% -U %POSTGRES_USER% -d %DB_NAME% -c "GRANT USAGE ON SCHEMA public TO %DB_USER%; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO %DB_USER%; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO %DB_USER%; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO %DB_USER%; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO %DB_USER%;"

echo.
echo 🎉 Database setup completed successfully!
echo.
echo 📋 Connection details:
echo    Database: %DB_NAME%
echo    User: %DB_USER%
echo    Host: %DB_HOST%
echo    Port: %DB_PORT%
echo.
echo 🔗 Connection string for your application:
echo    postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%
echo.
echo 🧪 Test the connection:
echo    psql postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%
echo.
echo 📊 Sample data includes:
echo    - 4 users (admin, field_worker, analyst, viewer)
echo    - 5 geological monitoring sites
echo    - 10+ sensors with real-time data
echo    - Active alerts and predictions
echo    - Environmental and maintenance data
echo.
echo 🔑 Demo login credentials:
echo    Username: field.worker@rockfall.system
echo    Password: demo123
echo.
pause
