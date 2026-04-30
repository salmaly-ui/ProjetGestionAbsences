#  GESTION DES ABSENCES MÉDICALES

Architecture générale : Base de données MySQL, backend Node.js/Express, frontend React, application mobile Android Java.

---
##  TECHNOLOGIES

Backend : Node.js, Express, MySQL2, JWT, bcrypt, multer, dotenv.  
Frontend : React 18, Axios, Chart.js, CSS moderne.  
Mobile : Java 17, RecyclerView, Retrofit, MaterialCardView, SharedPreferences, SwipeRefreshLayout.

---

##  STRUCTURE DU PROJET
```
GestionAbsence/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── absenceController.js
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── absenceModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── absenceRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   │   └── justificatifs/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── logo.png
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.js
│   │   │   ├── Sidebar.js
│   │   │   ├── SplashScreen.js
│   │   │   └── Toast.js
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── Absences.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Users.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── mobile/
    └── app/
        ├── src/main/
        │   ├── java/com/ens/absences/
        │   │   ├── adapters/
        │   │   │   ├── AbsenceAdapter.java
        │   │   │   └── LogAdapter.java
        │   │   ├── api/
        │   │   │   ├── ApiClient.java
        │   │   │   └── ApiService.java
        │   │   ├── models/
        │   │   │   ├── Absence.java
        │   │   │   ├── LoginRequest.java
        │   │   │   ├── LoginResponse.java
        │   │   │   └── StatusLog.java
        │   │   ├── utils/
        │   │   │   └── SessionManager.java
        │   │   ├── DeclarerAbsenceActivity.java
        │   │   ├── DetailAbsenceActivity.java
        │   │   ├── LoginActivity.java
        │   │   ├── MainActivity.java
        │   │   ├── RegisterActivity.java
        │   │   └── SplashActivity.java
        │   └── res/
        │       ├── drawable/
        │       ├── layout/
        │       ├── values/
        │       └── mipmap/
        └── build.gradle
```
---
## Demonstration (partie Web)



https://github.com/user-attachments/assets/a18dc6f4-8a73-4be8-a2ad-736f758b9fa0


---
## Demonstration (partie Mobile

https://github.com/user-attachments/assets/5490f2ef-ab47-44aa-a21a-80723c412ed9

)

---
## 🗄️ BASE DE DONNÉES (MySQL)
```sql
CREATE DATABASE absences_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('etudiant','agent','admin') DEFAULT 'etudiant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_absences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  reason TEXT,
  status ENUM('en_attente','en_cours','acceptee','refusee') DEFAULT 'en_attente',
  agent_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  absence_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (absence_id) REFERENCES medical_absences(id) ON DELETE CASCADE
);

CREATE TABLE absence_status_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  absence_id INT NOT NULL,
  changed_by INT,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  comment TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (absence_id) REFERENCES medical_absences(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (nom, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2b$10$...', 'admin');
```
---

##  INSTALLATION

### BACKEND
cd backend  
npm install  
npm run dev  
http://localhost:5000  

### FRONTEND
cd frontend  
npm install  
npm start  
http://localhost:3000  

### MOBILE
Ouvrir Android Studio  
Sync Gradle  
Lancer sur téléphone ou émulateur  

BASE_URL (mobile) :
http://192.168.x.x:5000/api/

---

##  FONCTIONNALITÉS

Étudiant (Mobile) : déclaration absence, justificatif, suivi, historique  
Agent (Frontend) : validation, refus, commentaires, statistiques  
Admin (Frontend) : gestion utilisateurs + système  

---

##  API PRINCIPALES

POST /api/auth/login  
POST /api/auth/register  
GET /api/absences/mes-absences  
POST /api/absences  
GET /api/absences  
POST /api/absences/validate  
POST /api/absences/refuse  
POST /api/absences/encours  
GET /api/absences/:id/logs  
GET /api/users  
DELETE /api/users/:id  

---

##  CONFIGURATION

JWT_SECRET=SECRET123  
Configurer IP backend pour mobile  
Configurer db.js (MySQL)

---

##  DÉPANNAGE

MySQL error → vérifier connexion DB  
Android NetworkError → utiliser IP locale  
Token invalide → vérifier JWT + heure système  
Upload fichier → augmenter limite multer  

---

##  AUTEUR

Salma Laouy  
ENS Marrakech – Licence Éducation Informatique S6  

Projet académique – usage éducatif
