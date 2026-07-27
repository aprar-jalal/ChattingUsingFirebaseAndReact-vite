# Firebase Real-Time Chat Application 💬

A real-time chat application built using **React** and **Firebase**.
The project focuses on implementing a modern chat system with authentication, real-time messaging, user presence, message status tracking, and a clean code architecture.

---

## 🚀 Project Overview

This project is a real-time messaging application that allows users to:

- Create an account and login securely.
- Search for other users.
- Start conversations.
- Send and receive messages instantly.
- See users' online/offline status.
- Track message delivery status.
- Track when messages are seen.
- Display unread message counters.
- Update data in real time using Firebase listeners.

The main goal of this project was to understand Firebase deeply and build a scalable frontend architecture.

---

# 🛠️ Technologies Used

## Frontend

- React.js
- Vite
- React Router
- React Hook Form
- CSS Modules
- Font Awesome Icons

## Backend / Database

- Firebase Authentication
- Firebase Firestore
- Firebase Realtime Database

## Firebase Features Used

- Authentication with Email & Password
- Firestore CRUD operations
- Firestore `onSnapshot` for real-time updates
- Realtime Database Presence System
- Firebase Timestamps

---

# 📂 Project Structure

```
src
│
├── components
│   ├── ChatList
│   ├── ChatMessage
│   ├── ChatItem
│   ├── Navbar
│   └── ...
│
├── Context
│   └── AuthContext.jsx
│
├── hooks
│   ├── useAuth
│   ├── useMessages
│   ├── useSendMessage
│   ├── useChats
│   ├── useSearchUsers
│   └── ...
│
├── services
│   ├── MessagesService.js
│   ├── ChatServices.js
│   └── userService.js
│
├── config
│   └── firebase-config.js
│
└── App.jsx
```

---

# 🏗️ Architecture

The project follows a separation of concerns approach.

## Components

Responsible only for:

- Rendering UI
- Handling user interaction
- Displaying data

---

## Services

Responsible for Firebase logic:

Examples:

- Creating chats
- Sending messages
- Updating message status
- Searching users

This keeps Firebase operations away from UI components.

---

## Custom Hooks

Custom hooks connect components with services.

Examples:

### useMessages

Responsible for:

- Listening to messages in real time.
- Managing loading and error states.

---

### useSendMessage

Responsible for:

- Sending messages.
- Creating chats when needed.

---

### useSearchUsers

Responsible for:

- Searching users by name.
- Managing search results.

---

# 🔐 Authentication System

Firebase Authentication is used for user management.

Features:

- Register new users.
- Login users.
- Detect authentication state.

Authentication state is managed globally using:

```
AuthContext
```

Example:

```javascript
onAuthStateChanged(auth, callback)
```

This keeps user information available throughout the application.

---

# 👥 Users Collection

Each user has a document inside Firestore:

```
users
 |
 |-- userId
      |
      ├── Name
      ├── email
      ├── photoURL
      ├── isOnline
      └── lastSeen
```

---

# 💬 Chat System

Chats are stored inside Firestore:

```
Chat
 |
 |-- chatId
      |
      ├── members[]
      ├── lastMessage
      ├── updatedAt
      |
      └── messages
            |
            |-- messageId
                  |
                  ├── text
                  ├── senderId
                  ├── createdAt
                  └── status
```

---

# 📩 Message Status System

Messages use a status-based system:

```
sent
 |
 v
delivered
 |
 v
seen
```

## Sent

The message was created successfully.

Displayed as:

✓

---

## Delivered

The message reached the receiver.

Displayed as:

✓✓ (gray)

---

## Seen

The receiver opened the chat.

Displayed as:

✓✓ (green)

---

# ⚡ Real-Time Features

The project uses Firebase listeners:

## Firestore onSnapshot

Used for:

- Messages updates.
- Chats updates.
- User changes.

Example:

```javascript
onSnapshot(query, callback)
```

Whenever data changes in Firebase, the UI updates automatically.

---

# 🟢 Online / Offline Presence

User presence is implemented using:

```
Firebase Realtime Database
```

because it provides better support for connection status.

The system tracks:

- Online users.
- Offline users.
- Last seen time.

---

# 🔎 User Search

Users can search for other users by name.

Search flow:

```
Input
 |
 v
useSearchUsers Hook
 |
 v
userService
 |
 v
Firestore Query
 |
 v
Search Results
```

---

# 🔔 Unread Messages Counter

Unread counter depends on message status.

Logic:

- Messages with status:
  - sent
  - delivered

are counted as unread.

When the chat is opened:

```
status → seen
```

and the counter disappears.

---

# 📦 Installation

Clone the project:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

---

# 🔥 Firebase Configuration

Create a Firebase project and enable:

- Authentication
- Firestore Database
- Realtime Database

Add your Firebase configuration:

```
src/config/firebase-config.js
```

Example:

```javascript
const firebaseConfig = {
 apiKey:"",
 authDomain:"",
 projectId:"",
 storageBucket:"",
 messagingSenderId:"",
 appId:""
}
```

---

# 📚 What I Learned

During this project I learned:

- How Firebase Authentication works.
- How Firestore CRUD operations work.
- How to build real-time applications using snapshots.
- How to structure React projects professionally.
- How to separate UI logic from business logic.
- How to manage global authentication state.
- How to implement message states like WhatsApp.
- How Firebase Realtime Database handles presence.

---

# 🔮 Future Improvements

Possible improvements:

- Image and file sharing.
- Typing indicator.
- Push notifications.
- Message reactions.
- Group chats.
- Better mobile responsiveness.
- Message pagination.

---

# 👩‍💻 Author

Aprar Ismail

Software Engineering Student
