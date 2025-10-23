# 🚀 Chatify: Modern Real-Time Chat & Video Application

**Chatify** is a full-stack, real-time chat application featuring direct messaging, contact management, and one-to-one video calling powered by WebRTC and Socket.IO.

The project is split into two main components: a feature-rich **React/Vite frontend** and a **secure Node.js/Express backend**.

---

## ✨ Features

* **Real-Time Messaging:** Instantaneous message delivery using Socket.IO.
* **One-to-One Video Calling (WebRTC):** Secure, peer-to-peer video calls using simple-peer for signaling.
* **Authentication:** Secure JWT-based authentication with cookie persistence across domains (Vercel/Render friendly).
* **User Management:** Sign up, log in, view online users, and update profile pictures.
* **Responsive UI:** Clean, modern, and fully responsive design built with Tailwind CSS and DaisyUI.
* **Theming:** Multiple built-in dark and light themes (Night, Dracula, Valentine, Forest, etc.) for a personalized experience.

---

## 🛠 Tech Stack

| Component           | Technology                              | Description                                                                    |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| Frontend            | React, Vite                             | Fast development setup for the UI.                                             |
| Styling             | Tailwind CSS, DaisyUI                   | Utility-first CSS for rapid, modern theming and styling.                       |
| State Management    | Zustand                                 | Lightweight and fast state management.                                         |
| Real-Time           | Socket.IO-Client, Simple-Peer           | Messaging and WebRTC video call signaling.                                     |
| Backend             | Node.js, Express                        | REST API and HTTP server.                                                      |
| Database            | MongoDB, Mongoose                       | NoSQL database for data persistence.                                           |
| Real-Time Signaling | Socket.IO                               | WebSocket server for chat and WebRTC signaling exchange.                       |
| Deployment          | Vercel (Frontend), Render (Backend/API) | Serverless hosting for static assets and persistent server for API/WebSockets. |

---

## ☁️ Deployment Guide

This application uses a hybrid deployment model essential for WebSocket functionality.

### 1. Backend Deployment (Render)

* Deploy the backend repository to Render as a **Web Service**.
* Ensure the start command is set to `npm start` (or `node src/index.js`).
* Retrieve the final public API URL (e.g., `https://chatify-3qre.onrender.com`).

### 2. Frontend Deployment (Vercel)

* Deploy the frontend repository to Vercel.
* In Vercel Project Settings, set the **Root Directory** to `frontend/`.
* Set this critical environment variable in Vercel:

```
Key: VITE_API_URL
Value: https://chatify-3qre.onrender.com
```

* **CORS & Cookie Fixes:**

  * Backend JWT cookie: `sameSite: 'None'` and `secure: true` in production.
  * Backend CORS: Include your Vercel domain (`https://ping-it-up.vercel.app`) in the origin list.

---

## 💻 Author

Author: Abhishek Sahay

[Github](https://github.com/abhi5hek001)
[LinkedIn](https://www.linkedin.com/in/abhi5hek001/)