# 📝 Todo App

A modern full-stack **Todo Application** built with **Node.js**, **Express.js**, **MongoDB**, **EJS**, **JWT Authentication**, **WebSockets**, and **Nodemailer**. The application enables users to manage daily tasks while receiving real-time and email notifications for task updates and overdue tasks.

---

 🚀 Features

## Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt

### Task Management
- Create tasks
- Update tasks
- Delete tasks
- Mark tasks as completed
- Re-open completed tasks
- Filter tasks by status
- Assign due dates

### Automatic Task Monitoring
- Tasks automatically become **Overdue** when their due date passes.
- Background scheduler continuously checks for overdue tasks.

### Notifications
- Real-time notifications using WebSockets
- Email notifications using Nodemailer
- Notifications when:
  - A task is completed
  - A task becomes overdue

### Security
- JWT Authentication
- Password hashing with bcrypt
- Protected API endpoints
- User-specific task access

---

# 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- EJS
- JWT (jsonwebtoken)
- WebSocket (ws)
- Nodemailer
- node-cron
- bcrypt

---

# 📂 Project Structure

```
todo-app/
│
├── config/
│ └── db.js
│
├── cron/
│ └── overdueTask.js
│
├── middleware/
│ └── jwtAuth.js
│
├── models/
│ ├── Task.js
│ └── User.js
│
├── routes/
│ ├── authentication.js
│ └── taskRoutes.js
│
├── utils/
│ └── email.js
│
├── views/
│ ├── index.ejs
│ ├── login.ejs
│ ├── register.ejs
│ └── tasks.ejs
│
├── websocket.js
├── app.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/todo-app.git
```

Move into the project

```bash
cd todo-app
```

Install dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_google_app_password

NODE_ENV=development
```

---

# ▶️ Running the Application

Development

```bash
npm start
```

or

```bash
node app.js
```

The application will run on

```
http://localhost:3000
```

---

# 📌 API Overview

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |

---

## Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /tasks | View tasks |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| PATCH | /tasks/:id/complete | Complete task |
| DELETE | /tasks/:id | Delete task |

---

# 📩 Notifications

The application sends notifications when:

- ✅ A task is completed.
- ⏰ A task becomes overdue.

Notifications are delivered through:

- WebSockets
- Email

---

# ⏳ Overdue Task Scheduler

A background cron job checks every minute for pending tasks whose due dates have passed.

Once detected:

- Status changes to **Overdue**
- Email notification is sent
- WebSocket notification is sent

---

# 🔒 Authentication

JWT tokens secure protected routes and WebSocket connections.

Passwords are securely hashed using bcrypt before storage.

---

# 🌐 Deployment

Backend: - Render

Database: - MongoDB Atlas

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Login Page <img width="986" height="584" alt="image" src="https://github.com/user-attachments/assets/802d6d2b-c879-4f7a-80cb-2cfd28e4dfc5" />

- Registration Page <img width="875" height="578" alt="image" src="https://github.com/user-attachments/assets/bbe0862e-9bdb-41fa-bfb5-f1fca12645ae" />

- Task Dashboard

---

# 🔮 Future Improvements

- Task categories
- Priority levels
- File attachments
- User profile
- Dark/Light theme
- Calendar integration
- Task reminders
- Drag-and-drop task management

---

# 👨‍💻 Author

**Ofulue Emmanuel Chisom**

GitHub:

https://github.com/CHEESOM11

---

⭐ If you found this project helpful, consider giving it a star on GitHub.
