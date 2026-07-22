# 💬 Chatting Website

A real-time chatting application built using React and Firebase.  
The application allows users to register, search for other users, start conversations, send messages, and track unread messages in real time.

---

# 🚀 Features

- User authentication using Firebase Authentication.
- Create a user profile after registration.
- Search for users by name.
- Start a new conversation with another user.
- Real-time messaging using Firebase Firestore.
- Display the latest message in chat list.
- Track unread messages count.
- Mark messages as seen when opening a chat.
- Display user information in Navbar.
- Real-time updates without refreshing the page.

---

# 🛠️ Technologies Used

## Frontend

### React
Used for building reusable UI components and managing the application interface.

### Vite
Used as the development environment and build tool for a fast React application.

### React Router DOM
Used for navigation between application pages.

### CSS Modules
Used for component-level styling and preventing CSS conflicts.

### React Hook Form
Used for handling forms and validation, especially user registration.

---

# 🔥 Firebase Services

## Firebase Authentication

Used for:

- User registration.
- User login.
- Managing authenticated users.

---

## Cloud Firestore

Used as the application's database.

Firestore stores:

### Users Collection

Stores user information:


users
|
userId
|
├── Name
├── email
├── photoURL
├── searchName
└── isOnline


---

### Chat Collection

Stores conversations:


Chat
|
chatId
|
├── members
├── lastMessage
└── updatedAt


---

### Messages Subcollection

Stores messages inside each chat:


Chat
|
chatId
|
messages
|
messageId
|
├── text
├── senderId
├── createdAt
└── seen


---

# 📚 Project Architecture

The project follows a layered architecture:


Components
|
↓
Hooks
|
↓
Services
|
↓
Firebase


---

# 📂 Folder Structure


src
│
├── Components
│ ├── Chat
│ ├── ChatList
│ ├── ChatItem
│ ├── ChatMessage
│ ├── Navbar
│ └── SignUp
│
├── hooks
│ ├── useChats.js
│ ├── useMessages.js
│ ├── useSendMessages.js
│ ├── useSearchUsers.js
│ ├── useUnreadCount.js
│ └── useMarkMessagesSeen.js
│
├── services
│ ├── ChatServices.js
│ ├── MessagesService.js
│ └── UserService.js
│
├── Context
│ └── AuthContext.jsx
│
├── config
│ └── firebase-config.js
│
└── App.jsx


---

# 🧩 Main Libraries

## firebase

Firebase SDK used to connect React with Firebase services.

Used features:

- Authentication
- Firestore Database

---


## react-hook-form

Used for:

- Form handling.
- Input validation.
- Managing form states.

---

## react-router-dom

Used for:

- Page navigation.
- Routing between application pages.

---

# 🔄 Real-Time Data Flow

## Sending Message


User clicks Send
|
↓
ChatMessage Component
|
↓
useSendMessage Hook
|
↓
MessagesService
|
↓
Firestore addDoc()


---

## Receiving Messages


Firestore onSnapshot()
|
↓
MessagesService
|
↓
useMessages Hook
|
↓
ChatMessage Component


---

# 🔔 Unread Messages System

Unread messages are calculated using:


seen == false
AND
senderId != currentUser


When the user opens the chat:


useMarkMessagesSeen
|
↓
markMessagesAsSeen()
|
↓
Update seen = true


---

# 🔐 Authentication Context

The application uses AuthContext to provide the authenticated user globally.

Instead of calling Firebase authentication in every component, the user state is stored once:

```jsx
<AuthContext.Provider value={{user, loading}}>

Components can access:

const { user } = useAuth();
⚙️ Installation

Clone the repository:

git clone <repository-url>

Install dependencies:

npm install

Run the project:

npm run dev
🔧 Environment Setup

Create a Firebase project and add your Firebase configuration:

src/config/firebase-config.js

Add:

Firebase API Key
Auth Domain
Project ID
Storage Bucket
Messaging Sender ID
App ID
🎯 Future Improvements
Add image/file sharing.
Add typing indicator.
Add online/offline status tracking.
Add message reactions.
Add notifications.
Add message deletion.
Add message editing.
👩‍💻 Author

Aprar Ismail

Software Engineering Student
