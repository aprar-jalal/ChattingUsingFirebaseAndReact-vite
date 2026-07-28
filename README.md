# 💬 Real-Time Chat Application

A modern real-time chat application built with **React + Vite**, **Firebase Authentication**, **Cloud Firestore**, **Firebase Realtime Database**, and **Cloudinary**.

The application supports real-time private conversations, text messages, voice messages, images, videos, files, message status tracking, online presence, unread counters, user search, profile management, and media uploads.

---

## 📌 Table of Contents

* [Features](#-features)
* [Technologies](#-technologies)
* [Project Architecture](#-project-architecture)
* [Project Structure](#-project-structure)
* [Authentication](#-authentication)
* [Firestore Database](#-firestore-database)
* [Realtime Messaging](#-realtime-messaging)
* [Message Status](#-message-status)
* [Unread Messages](#-unread-messages)
* [Audio Messages](#-audio-messages)
* [Attachments](#-attachments)
* [Cloudinary Uploads](#-cloudinary-uploads)
* [User Search](#-user-search)
* [Online Presence](#-online-presence)
* [Profile Settings](#-profile-settings)
* [Custom Hooks](#-custom-hooks)
* [Services Layer](#-services-layer)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Running the Project](#-running-the-project)
* [How the Application Works](#-how-the-application-works)
* [Future Improvements](#-future-improvements)

---

# ✨ Features

### 🔐 Authentication

* User registration
* Login with email and password
* Firebase Authentication
* User profile creation
* User profile picture
* Protected authenticated application flow

### 💬 Chat

* Private one-to-one conversations
* Create a new chat between two users
* Real-time messages
* Automatic scrolling to the latest message
* Last message preview
* Chat ordering based on latest activity

### 📝 Text Messages

Users can send normal text messages.

Each text message contains:

```js
{
  type: "text",
  text: "Hello!",
  fileURL: null,
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent"
}
```

### 🎤 Voice Messages

The application supports:

* Microphone access
* Audio recording using `MediaRecorder`
* Audio Blob creation
* Uploading audio to Cloudinary
* Saving the audio URL in Firestore
* Playing audio directly inside the chat

### 📎 Attachments

Users can upload:

* 🖼️ Images
* 🎥 Videos
* 📄 Files

All attachments are uploaded to Cloudinary before their URL is stored in Firestore.

### 👁️ Message Status

Messages support three statuses:

```text
sent → delivered → seen
```

The UI displays:

* ✓ Sent
* ✓✓ Delivered
* ✓✓ Seen

### 🔢 Unread Messages

The application keeps track of unread messages and displays an unread counter for each conversation.

When messages are seen, the unread counter is removed.

### 🟢 Online Presence

The application uses Firebase Realtime Database to track whether users are:

* Online
* Offline

The application also stores the last time the user's presence changed.

### 🔎 User Search

Users can search for other users by name.

The application uses a normalized `searchName` field to make searching easier.

### ⚙️ Profile Settings

Users can update:

* Profile picture
* Name
* Phone number

The profile picture is uploaded to Cloudinary and the URL is saved in Firestore.

---

# 🛠️ Technologies

## Frontend

* React
* Vite
* JavaScript
* CSS Modules
* React Hooks
* React Router
* React Hook Form

## Backend / Services

* Firebase Authentication
* Cloud Firestore
* Firebase Realtime Database
* Cloudinary

## Other Libraries

* `react-toastify`
* Font Awesome
* Firebase SDK

---

# 🏗️ Project Architecture

The project follows a layered architecture:

```text
Components
    ↓
Custom Hooks
    ↓
Services
    ↓
Firebase / Cloudinary
```

For example:

```text
ChatMessage.jsx
      ↓
useSendMessage.js
      ↓
MessagesService.js
      ↓
Firestore
```

For attachments:

```text
AttachmentMenu.jsx
      ↓
useUploadAttachment.js
      ↓
uploadFile.js
      ↓
Cloudinary
      ↓
useSendMessage.js
      ↓
Firestore
```

This structure keeps the UI components clean and separates business logic from Firebase and Cloudinary operations.

---

# 📁 Project Structure

A simplified project structure:

```text
src/
│
├── assets/
│   └── avatar.webp
│
├── Components/
│   ├── AttachmentMenu/
│   │   ├── AttachmentMenu.jsx
│   │   └── AttachmentMenu.module.css
│   │
│   ├── ChatMessage/
│   │   ├── ChatMessage.jsx
│   │   └── ChatMessage.module.css
│   │
│   ├── ChatList/
│   ├── ChatItem/
│   ├── Navbar/
│   └── ...
│
├── Context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth
│   ├── useChats
│   ├── useMessages
│   ├── useSearchUsers
│   ├── useUser
│   ├── useCreateChat
│   ├── useSendMessages
│   ├── useSendAudioMessage
│   ├── useAudioRecorder
│   ├── useUploadAttachment
│   ├── useMarkMessagesSeen
│   ├── usePresence
│   └── useUpdateProfile
│
├── services/
│   ├── firebase_firestore.js
│   ├── ChatServices.js
│   ├── MessagesService.js
│   ├── userService.js
│   └── uploadFile.js
│
├── Pages/
│   ├── Login/
│   ├── SignUp/
│   ├── Chat/
│   └── Settings/
│
├── config/
│   └── firebase-config.js
│
├── App.jsx
└── main.jsx
```

---

# 🔐 Authentication

Firebase Authentication is used for account creation and login.

Registration uses:

```js
createUserWithEmailAndPassword(
  auth,
  email,
  password
);
```

After creating the Firebase user, a corresponding document is created in Firestore.

Example:

```text
users/{uid}
```

---

# 🗄️ Firestore Database

The application uses Cloud Firestore as the main database.

## Users

Collection:

```text
users
```

Example document:

```js
{
  uid: "userId",
  Name: "John",
  searchName: "john",
  email: "john@gmail.com",
  number: "059xxxxxxx",
  photoURL: "https://res.cloudinary.com/...",
  isOnline: false,
  verified: false
}
```

---

# 💬 Chat Collection

Collection:

```text
Chat
```

Each chat document contains information about the conversation.

Example:

```js
{
  members: ["user1", "user2"],
  lastMessage: "Hello!",
  updatedAt: Timestamp
}
```

The `members` array contains the IDs of the users participating in the chat.

---

# 📨 Messages

Messages are stored as a subcollection inside each chat:

```text
Chat
└── chatId
    └── messages
        ├── messageId
        ├── messageId
        └── messageId
```

A message can look like:

```js
{
  type: "text",
  text: "Hello!",
  fileURL: null,
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent"
}
```

For an image:

```js
{
  type: "image",
  text: null,
  fileURL: "https://res.cloudinary.com/...",
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent"
}
```

---

# 🔄 Realtime Messaging

Messages are received in real time using Firestore `onSnapshot`.

The application subscribes to:

```js
collection(
  db,
  "Chat",
  chatId,
  "messages"
)
```

and orders messages by:

```js
orderBy("createdAt", "asc")
```

This means users don't need to refresh the page when a new message arrives.

---

# 👁️ Message Status

Messages follow this flow:

```text
sent
  ↓
delivered
  ↓
seen
```

## Sent

The message has been successfully created in Firestore.

```js
status: "sent"
```

## Delivered

When the receiver receives the message, its status changes to:

```js
status: "delivered"
```

## Seen

When the receiver opens the conversation, delivered messages are changed to:

```js
status: "seen"
```

---

# 🔢 Unread Messages

Unread messages are retrieved using a Firestore query.

The application looks for messages that are not:

```js
status: "seen"
```

Then it excludes messages sent by the current user.

The resulting count is displayed as the unread counter.

---

# 🎤 Audio Messages

Audio recording is implemented using the browser's:

```js
navigator.mediaDevices.getUserMedia()
```

and:

```js
MediaRecorder
```

The process is:

```text
Click microphone
      ↓
Request microphone permission
      ↓
Start MediaRecorder
      ↓
Receive audio chunks
      ↓
Stop recording
      ↓
Create Blob
      ↓
Upload Blob to Cloudinary
      ↓
Receive secure URL
      ↓
Save URL in Firestore
      ↓
Display <audio controls>
```

Example:

```js
{
  type: "audio",
  text: null,
  fileURL: audioURL,
  senderId: currentUserId,
  createdAt: Timestamp,
  status: "sent"
}
```

---

# 📎 Attachments

Attachments are handled by the `AttachmentMenu` component.

The menu provides:

```text
+ 
├── 🖼️ Image
├── 📄 File
└── 🎥 Video
```

Each selected file is passed to:

```js
useUploadAttachment()
```

The hook handles:

1. Uploading the file
2. Getting the Cloudinary URL
3. Creating the Firestore message
4. Returning the uploaded URL
5. Managing loading state
6. Managing errors

---

# ☁️ Cloudinary Uploads

Cloudinary is used as external media storage.

The application uses a single upload function:

```js
uploadFile(file, type)
```

Supported upload types include:

```text
image
video
raw
```

Example:

```js
const url = await uploadFile(file, "image");
```

For videos:

```js
const url = await uploadFile(file, "video");
```

For normal files:

```js
const url = await uploadFile(file, "raw");
```

The upload process uses:

```js
FormData
```

and the Cloudinary unsigned upload preset.

---

# 🖼️ Image Messages

Images are displayed using:

```jsx
<img
  src={message.fileURL}
  alt="Sent image"
/>
```

The URL is stored in Firestore rather than storing the actual image inside Firestore.

---

# 🎥 Video Messages

Videos are displayed using:

```jsx
<video
  controls
  src={message.fileURL}
/>
```

The video itself is stored in Cloudinary.

Firestore only stores the URL.

---

# 📄 File Messages

Files are displayed as a link:

```jsx
<a
  href={message.fileURL}
  target="_blank"
  rel="noopener noreferrer"
>
  Open file
</a>
```

This allows users to open the uploaded file from Cloudinary.

---

# 🔎 User Search

Users can search for other users by name.

Each user has:

```js
searchName: data.name.toLowerCase()
```

This creates a normalized search field.

For example:

```text
Name: "Aprar Ismail"
searchName: "aprar ismail"
```

This makes searching case-insensitive.

---

# 🟢 Online Presence

Presence is handled using Firebase Realtime Database.

A user's status is stored under:

```text
status/{uid}
```

Example:

```js
{
  state: "online",
  lastChanged: Date.now()
}
```

When the user disconnects, Firebase's:

```js
onDisconnect()
```

mechanism is used to update their status.

---

# ⚙️ Profile Settings

The Settings page allows users to update:

```text
Profile picture
Name
Phone number
```

When changing the profile picture:

```text
Select image
    ↓
Upload to Cloudinary
    ↓
Get secure URL
    ↓
Update preview
    ↓
Save profile
    ↓
Update Firestore
```

The user's profile document is updated with:

```js
{
  Name: data.name,
  searchName: data.name.toLowerCase(),
  number: data.number,
  photoURL: data.photoURL
}
```

---

# 🪝 Custom Hooks

The application uses custom hooks to separate logic from UI.

## `useMessages`

Responsible for:

* Subscribing to messages
* Loading state
* Error state
* Real-time updates

---

## `useSendMessage`

Responsible for sending a message to Firestore.

```js
sendMessage(chat, userId, messageData)
```

---

## `useAudioRecorder`

Responsible for:

* Starting recording
* Stopping recording
* Managing MediaRecorder
* Creating the audio Blob
* Managing recording state

---

## `useSendAudioMessage`

Combines:

```text
Audio recording
      ↓
Cloudinary upload
      ↓
Firestore message
```

---

## `useUploadAttachment`

Responsible for:

* Uploading images
* Uploading videos
* Uploading files
* Managing loading state
* Managing errors

---

## `useMarkMessagesSeen`

Marks received messages as:

```js
status: "seen"
```

when the user opens a conversation.

---

## `usePresence`

Tracks whether a user is online or offline.

---

## `useSearchUsers`

Handles searching for users by name.

---

## `useCreateChat`

Creates a chat between two users.

---

## `useUpdateProfile`

Updates the user's:

* Name
* Phone number
* Profile picture

---

# 🧩 Services Layer

Firebase and Cloudinary operations are separated into service files.

This prevents components from directly containing large amounts of database logic.

---

## `MessagesService.js`

Responsible for:

* Creating messages
* Subscribing to messages
* Updating message status
* Marking messages as seen
* Tracking unread messages

---

## `ChatServices.js`

Responsible for:

* Creating chats
* Getting user's chats
* Subscribing to chat updates

---

## `userService.js`

Responsible for:

* Getting user information
* Updating user information
* Searching users

---

## `uploadFile.js`

Responsible for uploading:

* Images
* Videos
* Files
* Audio

to Cloudinary.

---

# 🌐 Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> Never commit your real environment variables or private credentials to GitHub.

---

# 🚀 Installation

Clone the project:

```bash
git clone YOUR_REPOSITORY_URL
```

Move into the project:

```bash
cd your-project-name
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Add the Firebase and Cloudinary configuration.

---

# ▶️ Running the Project

Start the Vite development server:

```bash
npm run dev
```

The application will run on a local URL similar to:

```text
http://localhost:5173
```

---

# 🏃 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🔄 How the Application Works

## User Registration

```text
User enters registration information
            ↓
Firebase Authentication
            ↓
Create Firebase user
            ↓
Upload profile picture
            ↓
Cloudinary returns URL
            ↓
Create users/{uid} document
            ↓
Navigate to Chat
```

---

## Sending Text Message

```text
User writes message
        ↓
useSendMessage
        ↓
createMessage()
        ↓
Firestore
        ↓
onSnapshot()
        ↓
Message appears immediately
```

---

## Sending Audio Message

```text
Click microphone
        ↓
MediaRecorder starts
        ↓
User stops recording
        ↓
Audio Blob created
        ↓
useSendAudioMessage
        ↓
Cloudinary
        ↓
Audio URL
        ↓
Firestore
        ↓
onSnapshot
        ↓
Audio appears in chat
```

---

## Sending Attachment

```text
Click +
    ↓
AttachmentMenu
    ↓
Select Image / Video / File
    ↓
useUploadAttachment
    ↓
uploadFile()
    ↓
Cloudinary
    ↓
URL
    ↓
Firestore
    ↓
onSnapshot
    ↓
Attachment appears in chat
```

---

## Message Status

```text
Sender
  │
  │ send
  ▼
sent
  │
  │ receiver receives
  ▼
delivered
  │
  │ receiver opens chat
  ▼
seen
```

---

# 🧠 Design Principles

The project follows several important development principles:

### Separation of Concerns

UI components are responsible mainly for rendering.

Firebase and Cloudinary logic lives inside services.

Business logic lives inside custom hooks.

---

### Reusable Services

Instead of repeating Firebase code inside components, common operations are centralized in service files.

---

### Reusable Hooks

Custom hooks allow components to reuse:

* Authentication
* Messages
* Chats
* Search
* Uploads
* Presence
* Profile updates

---

### Real-Time First

Firestore listeners are used so that users don't need to refresh the page to receive new messages.

---

# ⚠️ Important Notes

### Cloudinary

Cloudinary stores the actual media files.

Firestore stores the URLs.

This prevents large media files from being stored directly in Firestore.

### HEIC Images

Some browsers do not display `.heic` images directly using `<img>`.

For profile pictures and chat images, converting HEIC images to browser-compatible formats such as JPG/WebP may be necessary.

### Firestore Indexes

Some Firestore queries may require composite indexes.

For example:

```text
members
updatedAt
```

If Firebase reports that an index is required, create the suggested index from the Firebase Console.

---



# 📚 Main Technologies Summary

| Technology                 | Purpose                          |
| -------------------------- | -------------------------------- |
| React                      | Frontend UI                      |
| Vite                       | Development and build tool       |
| Firebase Authentication    | User authentication              |
| Firestore                  | Users, chats, and messages       |
| Firebase Realtime Database | Online presence                  |
| Cloudinary                 | Images, videos, audio, and files |
| React Hooks                | Component state and lifecycle    |
| Custom Hooks               | Business logic separation        |
| CSS Modules                | Component styling                |
| React Hook Form            | Form management                  |
| React Toastify             | Notifications                    |
| Font Awesome               | Icons                            |

---

# 👩‍💻 Project Goal

The main goal of this project is to build a complete real-time messaging application while applying modern frontend development concepts such as:

* Component-based architecture
* Custom React Hooks
* Context API
* Firebase Authentication
* Firestore real-time listeners
* CRUD operations
* Cloudinary media uploads
* File handling
* Browser Media APIs
* Reusable service layers
* Separation of concerns
* Real-time application state

---

# 📄 License

This project was created for educational and development purposes.
