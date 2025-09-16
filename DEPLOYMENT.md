# 🚀 Deployment Guide - Rockfall Prediction System

**Complete System Deployment Instructions**

## 📋 **System Status Overview**

### ✅ **Completed Components**

| Component | Status | Location | Description |
|-----------|--------|----------|-------------|
| **Backend API** | ✅ Complete | `/backend/` | FastAPI server with authentication, data management, and AI endpoints |
| **Web Frontend** | ✅ Complete | `/frontend/` | React.js dashboard with Material-UI and real-time features |
| **Mobile App** | ✅ Complete | `/mobile/` | React Native cross-platform mobile application |
| **Database Schema** | ✅ Complete | `/database/` | PostgreSQL with PostGIS, comprehensive schema with sample data |
| **AI/ML Models** | ✅ Complete | `/ml_models/` | Data fusion engine and prediction models |
| **Documentation** | ✅ Complete | `/README.md` | Comprehensive system documentation |

### 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROCKFALL PREDICTION SYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│  🌐 Web Frontend (React.js)     📱 Mobile App (React Native)   │
│  ├── Dashboard & Analytics      ├── Field Data Collection       │
│  ├── Site Management           ├── Camera Integration          │
│  ├── Alert System              ├── Offline Sync               │
│  └── User Administration       └── Push Notifications         │
├─────────────────────────────────────────────────────────────────┤
│               🔧 Backend API (FastAPI + Python)                │
│  ├── 🔐 Authentication & Authorization                         │
│  ├── 📡 WebSocket Real-time Communication                      │
│  ├── 📊 Data Management & Processing                          │
│  └── 🤖 AI/ML Prediction Endpoints                            │
├─────────────────────────────────────────────────────────────────┤
│  🗄️ Database (PostgreSQL + PostGIS)  ⚡ Cache (Redis)         │
│  ├── Geological Sites & Sensors      ├── Session Management    │
│  ├── Real-time Sensor Data          ├── Real-time Data       │
│  ├── Alerts & Predictions           └── Performance Cache    │
│  └── User & Permission Management                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ **Prerequisites**

### **System Requirements**
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: 10GB free space
- **Network**: Internet connection for initial setup and real-time features

### **Software Dependencies**
- **Node.js**: v18.0.0 or higher
- **Python**: v3.9.0 or higher
- **PostgreSQL**: v14.0 or higher with PostGIS extension
- **Redis**: v6.0 or higher (for caching and real-time features)

## 📦 **Installation Steps**

### **Step 1: Database Setup**

**Option A: Windows**
```cmd
cd database
setup.bat
```

**Option B: Linux/macOS**
```bash
cd database
chmod +x setup.sh
./setup.sh
```

**Manual Setup (if scripts fail):**
1. Install PostgreSQL with PostGIS extension
2. Create database: `createdb rockfall_prediction`
3. Run schema: `psql -d rockfall_prediction -f schema.sql`
4. Insert sample data: `psql -d rockfall_prediction -f sample_data.sql`

### **Step 2: Backend API Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at: http://localhost:8000**
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### **Step 3: Web Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

**Web Application will be available at: http://localhost:3000**

### **Step 4: Mobile App Setup**

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# For Android (requires Android Studio)
npx react-native run-android

# For iOS (requires Xcode - macOS only)
npx react-native run-ios
```

### **Step 5: Redis Setup (Optional but Recommended)**

**Windows:**
```cmd
# Download Redis for Windows or use Docker
docker run -d -p 6379:6379 redis:alpine
```

**Linux/macOS:**
```bash
# Install Redis
sudo apt-get install redis-server  # Ubuntu
brew install redis                 # macOS

# Start Redis
redis-server
```

## 🔧 **Configuration**

### **Database Configuration**
```sql
-- Connection Details
Host: localhost
Port: 5432
Database: rockfall_prediction
Username: rockfall_app
Password: rockfall_secure_pass_2024
```

### **Backend Configuration (.env)**
```env
# Database
DATABASE_URL=postgresql://rockfall_app:rockfall_secure_pass_2024@localhost:5432/rockfall_prediction

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (adjust for your deployment)
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# File uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### **Frontend Configuration (.env)**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_ENVIRONMENT=development
```

### **Mobile Configuration (.env)**
```env
API_BASE_URL=http://localhost:8000
WEBSOCKET_URL=ws://localhost:8000/ws
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
ENABLE_NOTIFICATIONS=true
ENVIRONMENT=development
```

## 🔐 **Security Setup**

### **1. Generate Secret Keys**
```bash
# Generate a secure secret key for JWT
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### **2. Database Security**
```sql
-- Change default passwords
ALTER USER rockfall_app WITH PASSWORD 'your-secure-password';

-- Restrict permissions (production)
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO rockfall_app;
```

### **3. API Security**
- Enable HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Enable request validation

## 🧪 **Testing the System**

### **1. Backend API Tests**
```bash
cd backend
python -m pytest tests/ -v
```

### **2. Frontend Tests**
```bash
cd frontend
npm test
```

### **3. End-to-End Testing**
1. Start all services (database, backend, frontend)
2. Open web app: http://localhost:3000
3. Login with demo credentials:
   - Username: `field.worker@rockfall.system`
   - Password: `demo123`
4. Verify dashboard loads with sample data
5. Test real-time features and navigation

### **4. Mobile App Testing**
1. Start Metro bundler: `npm start`
2. Run on device/emulator
3. Test offline functionality
4. Verify push notifications

## 📊 **Sample Data**

The system includes comprehensive sample data:

### **Users (4 accounts)**
- **Admin**: `admin@rockfall.system` / `demo123`
- **Field Worker**: `field.worker@rockfall.system` / `demo123`
- **Analyst**: `analyst@rockfall.system` / `demo123`
- **Viewer**: `viewer@rockfall.system` / `demo123`

### **Geological Sites (5 locations)**
- Mountain Ridge Alpha (High Risk)
- Cliff Side Beta (Medium Risk)
- Quarry Gamma (Low Risk - Maintenance)
- Canyon Delta (Critical Risk)
- Valley Epsilon (Medium Risk)

### **Sensors (10+ active sensors)**
- Seismic sensors with real-time data
- Tilt meters for slope monitoring
- Weather stations for environmental data
- Cameras for visual monitoring
- Strain gauges for structural analysis

## 🚀 **Production Deployment**

### **Docker Deployment (Recommended)**
```bash
# Clone repository
git clone <repository-url>
cd rockfall-prediction-system

# Build and start all services
docker-compose up -d

# Check services
docker-compose ps
```

### **Manual Production Setup**
1. **Use production-grade database** (managed PostgreSQL)
2. **Set up reverse proxy** (Nginx/Apache)
3. **Enable HTTPS** (Let's Encrypt/SSL certificates)
4. **Configure monitoring** (logs, metrics, alerts)
5. **Set up backups** (database and file storage)
6. **Configure CI/CD pipeline** (GitHub Actions/Jenkins)

### **Environment Variables (Production)**
```env
# Production settings
DATABASE_URL=postgresql://user:password@db-host:5432/rockfall_prediction
REDIS_URL=redis://redis-host:6379
SECRET_KEY=production-secret-key-very-long-and-secure
CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production

# Enable security features
HTTPS_ONLY=true
SECURE_COOKIES=true
RATE_LIMITING=true
```

## 📈 **Monitoring & Maintenance**

### **System Health Checks**
```bash
# Backend health
curl http://localhost:8000/health

# Database connectivity
psql -h localhost -U rockfall_app -d rockfall_prediction -c "SELECT 1;"

# Redis connectivity
redis-cli ping
```

### **Log Monitoring**
- Backend logs: Check FastAPI application logs
- Database logs: Monitor PostgreSQL logs
- Frontend logs: Browser developer console
- Mobile logs: Device logs and crash reporting

### **Performance Monitoring**
- API response times
- Database query performance
- Memory and CPU usage
- Real-time connection stability

## 🆘 **Troubleshooting**

### **Common Issues**

**1. Database Connection Failed**
```bash
# Check PostgreSQL service
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verify credentials
psql -h localhost -U rockfall_app -d rockfall_prediction
```

**2. Node.js Module Errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Python Dependencies Issues**
```bash
# Update pip
pip install --upgrade pip

# Reinstall requirements
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

**4. Mobile Build Errors**
```bash
# Android: Clean build
cd android && ./gradlew clean && cd ..

# iOS: Clean build folder in Xcode
```

### **Getting Help**
- Check the logs in each component directory
- Review the API documentation at `/docs`
- Verify environment variables are set correctly
- Ensure all services are running and accessible

## ✅ **Verification Checklist**

- [ ] PostgreSQL database is running and accessible
- [ ] Backend API is running on port 8000
- [ ] Web frontend is accessible on port 3000
- [ ] Mobile app builds and runs successfully
- [ ] Sample data is loaded correctly
- [ ] Demo login credentials work
- [ ] Real-time features are functional
- [ ] All environment variables are configured

## 🎯 **Next Steps**

1. **Customize the system** for your specific geological monitoring needs
2. **Add real geological sites** and sensor configurations
3. **Integrate with external APIs** (weather services, geological surveys)
4. **Set up production deployment** with proper security and monitoring
5. **Train staff** on system usage and maintenance procedures

---

**🎉 Your Rockfall Prediction System is now ready for deployment!**

For additional support and advanced configuration options, refer to the comprehensive documentation in each component directory.
