# TribEd Setup & Execution Guide

---

## 1. Web Application (Full-Stack Express + React Vite)
The web application runs the full demo with zero external configuration on Port 3000.

### Prerequisites
- Node.js >= 18
- npm >= 9

### Startup
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 2. Python FastAPI Backend + PostgreSQL (Docker Compose)
For running the standalone Python FastAPI REST API with real PostgreSQL:

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (if running locally without Docker)

### Running with Docker Compose
```bash
cd backend
docker-compose up --build
```
This automatically:
1. Starts PostgreSQL 16 container (`tribed_postgres` on port 5432).
2. Runs database migrations and seeds deterministic fixtures (`python -m app.seed`).
3. Starts the FastAPI server (`tribed_fastapi` on port 8000).

API Documentation will be live at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Running Python Tests
```bash
cd backend
pip install -r requirements.txt
pytest
```

---

## 3. Flutter Android Mobile Application
The mobile application source code is located in `/mobile_flutter`.

### Prerequisites
- Flutter SDK >= 3.0.0
- Android Studio / Android SDK (for physical device or emulator)

### Execution Commands
```bash
cd mobile_flutter
flutter pub get
flutter run
```

### Build APK
```bash
flutter build apk --release
```
*(An interactive simulator of the Flutter application is also integrated directly into the web application under the "Android App" mode).*
