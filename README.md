# 🏙️ CivicFix – Smart Civic Complaint Management System

CivicFix is a web-based platform designed to bridge the gap between citizens and government authorities. It allows citizens to report civic issues such as garbage collection, road damage, water supply problems, and other municipal concerns. Government officials can then track, manage, and resolve these complaints through a centralized dashboard.

The main goal of CivicFix is to improve transparency, efficiency, and accountability in civic issue management while providing a simple and user-friendly interface for both citizens and authorities.

---

## 📂 Project Structure

```
CivicFix
│
├── frontend/        # React-based user interface
├── backend/         # FastAPI backend APIs
├── database/        # MongoDB collections
└── README.md        # Project documentation
```

---

## ✨ Features

### 👤 Citizen Features
- User registration and login
- Submit civic complaints
- Upload images or videos as evidence
- Track complaint status
- View complaint history

### 🏢 Government Official Features
- Dashboard to manage complaints
- View complaints based on category and status
- Update complaint status (Pending, In Progress, Resolved)
- Access complaint details and attachments

### 📊 Dashboard Features
- View total complaints
- View pending complaints
- View resolved complaints
- Complaint analytics and trends

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3 / TailwindCSS
- JavaScript

### Backend
- FastAPI (Python)

### Database
- MongoDB

### Tools
- Git
- GitHub
- REST APIs

---

## 🚀 How to Run the Project

### Clone the Repository

```bash
git clone https://github.com/mohitpatidar2212/CivicFix.git
cd CivicFix

### Setup Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Setup Frontend

Open a new terminal:

cd frontend
npm install
npm start
```

---

## 📌 Future Enhancements

- AI-based complaint categorization
- Chatbot support for citizen queries
- Mobile application version
- Multilingual support
- Location-based complaint tracking

---

## 👨‍💻 Developed For

Smart India Hackathon (SIH)

---

## 📜 License

This project is developed for educational and educational purposes.
