# AI-Powered Legal Assistant

## 📌 Project Overview
The **AI-Powered Legal Assistant** is a chatbot designed to help users find relevant **Indian IPC sections** and provide legal guidance on property disputes, criminal law, and other legal matters. It is implemented as a **data science project** and deployed as a **web application** using **React, Django REST Framework, and Gemini API**.

## 🚀 Features
- **User Authentication**: Secure login using **Bearer Token Authentication**.
- **AI-Powered Legal Advice**: Uses the **Gemini API** (`gemini-pro` model) to generate responses.
- **Search IPC Sections**: Users can query legal issues and get relevant **Indian Penal Code (IPC) sections**.
- **Interactive Chatbot UI**: Built with **React and Tailwind CSS** for a seamless experience.
- **Backend API**: Developed using **Django REST Framework (DRF)**.
- **Database Storage**: Stores user information and queries securely.

## 🛠️ Tech Stack
### Frontend:
- **React** (for UI development)
- **Tailwind CSS** (for styling)

### Backend:
- **Django REST Framework (DRF)** (for API development)
- **PostgreSQL** (Database)
- **Gemini API (`gemini-pro`)** (for AI-powered legal responses)

### Authentication:
- **Bearer Token Authentication** (Secure user authentication)

## 📂 Project Structure
```plaintext
AI-Powered-Legal-Assistant/
│── backend/                # Django REST Framework (Backend)
│   ├── api/                # API Endpoints
│   ├── models.py           # Database Models
│   ├── views.py            # API Logic
│   ├── serializers.py      # DRF Serializers
│   ├── urls.py             # API Routes
│   ├── settings.py         # Django Settings
│
│── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── App.js          # Main App File
│   │   ├── index.js        # Entry Point
│   ├── package.json        # React Dependencies
│
│── dataset/                # CSV file with IPC sections
│── README.md               # Project Documentation
```

## 🖥️ Installation Guide
### Prerequisites
- **Node.js** (for frontend development)
- **Python 3.8+** (for backend development)
- **PostgreSQL** (Database)

### 🔹 Backend Setup (Django)
```bash
# Clone the repository
git clone https://github.com/your-repo/legal-assistant.git
cd legal-assistant/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the backend server
python manage.py runserver
```

### 🔹 Frontend Setup (React)
```bash
cd ../frontend

# Install dependencies
npm install

# Start the frontend server
npm start
```
The frontend runs at `http://localhost:3000/`, and the backend at `http://localhost:8000/`.

## 🔗 API Endpoints
### 🔹 User Authentication
- **`POST /api/login/`** → Logs in user and returns Bearer token.
- **`POST /api/register/`** → Registers a new user.

### 🔹 Legal Queries
- **`POST /api/legal-query/`** → AI chatbot processes legal questions and returns relevant IPC sections.
- **`GET /api/ipc-sections/`** → Fetches all IPC sections from the database.

### 🔹 User Profile
- **`GET /api/user/`** → Retrieves user profile and history.
- **`PUT /api/user/update/`** → Updates user profile.

## 📜 How to Use
1. **Register/Login** on the platform.
2. **Enter a legal query** (e.g., "What is the punishment for theft?").
3. **AI provides an answer** with relevant **IPC sections**.
4. **View enrolled legal courses** and learn about different laws.

## 🛡️ Security & Authentication
- **Bearer Token Authentication** is implemented using Django REST Framework.
- Users must provide an **Authorization Token** in requests.

## 🎯 Future Enhancements
- **Multi-language Support** (Hindi, Tamil, etc.).
- **Voice-based Legal Queries**.
- **Integration with Government Legal Databases**.

## 📝 Contributors
- **[Your Name]** – Backend Development (Django, API, Authentication)
- **[Team Member 2]** – Frontend Development (React, Tailwind CSS)
- **[Team Member 3]** – Data Science (IPC Dataset, Gemini API Integration)

## 📜 License
This project is licensed under the **MIT License**.

---
💡 **Need Help?** Contact us at [your-email@example.com] or open an issue on GitHub!

