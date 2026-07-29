# 💬 Real-Time Chat Application

A modern real-time private chat application built with **React + Vite**, **Firebase Authentication**, **Cloud Firestore**, **Firebase Realtime Database**, and **Cloudinary**.

The application supports real-time one-to-one conversations, text messages, voice messages, images, videos, files, message status tracking, online presence, unread message counters, user search, conversation search, user blocking, profile management, media uploads, and logout functionality.

---

## 📌 Table of Contents

* [Features](#-features)
* [Technologies](#-technologies)
* [Project Architecture](#-project-architecture)
* [Project Structure](#-project-structure)
* [Authentication](#-authentication)
* [Logout](#-logout)
* [Firestore Database](#-firestore-database)
* [Realtime Messaging](#-realtime-messaging)
* [Message Status](#-message-status)
* [Unread Messages](#-unread-messages)
* [Conversation Search](#-conversation-search)
* [User Search](#-user-search)
* [Block and Unblock Users](#-block-and-unblock-users)
* [Audio Messages](#-audio-messages)
* [Attachments](#-attachments)
* [Cloudinary Uploads](#-cloudinary-uploads)
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

## 🔐 Authentication

* User registration
* Login with email and password
* Firebase Authentication
* User profile creation
* Profile picture
* Authentication state management
* Automatic authentication state detection
* Protected application flow

---

## 🚪 Logout

Users can securely log out from the application using Firebase Authentication.

The logout process uses Firebase's:

```js
signOut(auth);
```

After logout:

```text
User clicks Logout
       ↓
Firebase signOut()
       ↓
Authentication state changes
       ↓
Current user becomes null
       ↓
Application returns to Login
```

This prevents unauthenticated users from continuing to access the chat interface.

---

# 💬 Chat

The application supports private one-to-one conversations.

Features include:

* Private conversations between two users
* Creating a new chat
* Real-time messages
* Last message preview
* Chat ordering by latest activity
* Automatic scrolling to the latest message
* Selecting conversations from the chat list
* Real-time updates without refreshing the page

---

# 📝 Text Messages

Users can send normal text messages.

Example:

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

Messages are stored inside the corresponding chat's `messages` subcollection.

---

# 🎤 Voice Messages

The application supports voice messages using the browser's Media APIs.

Features:

* Microphone permission
* Audio recording
* Start/stop recording
* Audio Blob creation
* Cloudinary upload
* Firestore URL storage
* Audio playback inside the conversation

The flow is:

```text
Click microphone
      ↓
MediaRecorder starts
      ↓
Record audio
      ↓
Stop recording
      ↓
Create Audio Blob
      ↓
Upload to Cloudinary
      ↓
Get audio URL
      ↓
Save message in Firestore
      ↓
Display audio player
```

---

# 📎 Attachments

Users can send different types of media and files.

Supported attachments:

* 🖼️ Images
* 🎥 Videos
* 📄 Files
* 🎤 Audio

The actual media is uploaded to **Cloudinary**.

Firestore stores only the URL of the uploaded file.

---

# 👁️ Message Status

Messages have three states:

```text
sent → delivered → seen
```

### Sent

The message was successfully created.

```js
status: "sent"
```

### Delivered

The receiver has received the message.

```js
status: "delivered"
```

### Seen

The receiver opened the conversation and the message was viewed.

```js
status: "seen"
```

The UI displays:

```text
✓   Sent
✓✓  Delivered
✓✓  Seen
```

---

# 🔢 Unread Messages

The application tracks unread messages for each conversation.

Unread messages are identified by checking their status.

Messages that have already been viewed have:

```js
status: "seen"
```

The unread counter is removed when the messages are marked as seen.

The flow is:

```text
New message
     ↓
Message is not seen
     ↓
Unread counter appears
     ↓
Receiver opens chat
     ↓
Messages marked as seen
     ↓
Unread counter disappears
```

---

# 🔎 Conversation Search

The application supports searching **inside the current conversation**.

When the user clicks the search icon in the chat header:

```text
Search mode opens
      ↓
Search input appears
      ↓
User enters a word
      ↓
Messages containing the word are found
      ↓
Matching text is highlighted
```

The feature is designed to work similarly to the search functionality in applications such as WhatsApp.

For example, if the conversation contains:

```text
Hello Aprar
How are you?
Hello, are you ready?
```

Searching for:

```text
Hello
```

will highlight the matching text inside the messages.

The search is performed against the messages that are already loaded for the selected conversation.

---

# 👤 User Search

Users can search for other users by name from the chat list.

The application uses a normalized:

```js
searchName
```

field.

For example:

```js
{
  Name: "Aprar Ismail",
  searchName: "aprar ismail"
}
```

The search query uses Firestore range queries:

```js
where("searchName", ">=", search)
where("searchName", "<=", search + "\uf8ff")
```

The flow is:

```text
User types name
      ↓
useSearchUsers()
      ↓
Firestore query
      ↓
Matching users
      ↓
Display search results
      ↓
Click user
      ↓
Create/Open chat
```

---

# 🚫 Block and Unblock Users

The application supports blocking and unblocking users.

When User A blocks User B:

```text
User A
  ↓
blocks User B
  ↓
User A cannot send messages
User B cannot send messages
```

Both users are informed about the block.

### User who blocked

User A sees:

```text
You blocked this user.
You can't send messages.
```

### User who was blocked

User B sees:

```text
You are blocked by this user.
You can't send messages.
```

Therefore, blocking works from both sides of the conversation.

---

## Block Data

The user's Firestore document contains block information.

Example:

```js
{
  blockedUser: ["userB"]
}
```

For the blocked user:

```js
{
  blockedBy: ["userA"]
}
```

This allows the application to determine whether:

```text
blockedByMe
```

or:

```text
blockedMe
```

is true.

---

## Block Flow

```text
User A clicks Block
        ↓
blockUser()
        ↓
User A:
blockedUser → User B
        ↓
User B:
blockedBy → User A
        ↓
Both users receive updated block state
        ↓
Both users are prevented from sending messages
```

---

## Unblock

The same structure is used for unblocking.

```text
User A clicks Unblock
        ↓
Remove User B from blockedUser
        ↓
Remove User A from User B's blockedBy
        ↓
Both users can communicate again
```

---

# 🟢 Online Presence

The application uses **Firebase Realtime Database** for online presence.

A user's presence is stored under:

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

The application can display:

```text
Online
```

or:

```text
Last seen 5 min ago
```

Firebase `onDisconnect()` is used to update the user's status when the connection is lost.

---

# 🗄️ Firestore Database

Cloud Firestore is the main database used by the application.

---

## 👤 Users Collection

Collection:

```text
users
```

Example document:

```js
{
  uid: "userId",
  Name: "Aprar Ismail",
  searchName: "aprar ismail",
  email: "aprar@gmail.com",
  number: "059xxxxxxx",
  photoURL: "https://res.cloudinary.com/...",
  blockedUser: [],
  blockedBy: []
}
```

---

# 💬 Chat Collection

Collection:

```text
Chat
```

Example:

```js
{
  members: ["user1", "user2"],
  lastMessage: "Hello!",
  updatedAt: Timestamp
}
```

The `members` array contains the IDs of both users participating in the conversation.

---

# 📨 Messages Subcollection

Messages are stored inside each chat:

```text
Chat
└── chatId
    └── messages
        ├── messageId
        ├── messageId
        └── messageId
```

Example text message:

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

Example image message:

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

Example audio message:

```js
{
  type: "audio",
  text: null,
  fileURL: "https://res.cloudinary.com/...",
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent"
}
```

---

# 🔄 Realtime Messaging

Firestore `onSnapshot()` is used to receive messages in real time.

The application subscribes to:

```js
collection(
  db,
  "Chat",
  chatId,
  "messages"
)
```

and orders messages using:

```js
orderBy("createdAt", "asc")
```

This means a new message appears automatically without refreshing the page.

---

# ☁️ Cloudinary Uploads

The application **does not use Firebase Storage**.

Instead, Cloudinary is used for storing media files.

Cloudinary handles:

* Images
* Videos
* Audio
* Files

The process is:

```text
User selects file
       ↓
FormData
       ↓
Cloudinary upload
       ↓
Cloudinary returns URL
       ↓
URL saved in Firestore
```

Firestore stores the URL instead of storing the actual media.

Example:

```js
{
  type: "image",
  fileURL: "https://res.cloudinary.com/..."
}
```

---

# 🖼️ Image Messages

Images are uploaded to Cloudinary and displayed using:

```jsx
<img
  src={message.fileURL}
  alt="Sent image"
/>
```

The actual image is not stored in Firestore.

---

# 🎥 Video Messages

Videos are stored in Cloudinary and displayed using:

```jsx
<video
  controls
  src={message.fileURL}
/>
```

---

# 📄 File Messages

Files are uploaded to Cloudinary.

The Firestore message stores the resulting URL:

```jsx
<a
  href={message.fileURL}
  target="_blank"
  rel="noopener noreferrer"
>
  Open file
</a>
```

---

# 🎤 Audio Messages

Audio files are also stored in Cloudinary.

The message stores the URL:

```js
{
  type: "audio",
  fileURL: audioURL
}
```

and the UI displays:

```jsx
<audio
  controls
  src={message.fileURL}
/>
```

---

# ⚙️ Profile Settings

Users can update:

* Profile picture
* Name
* Phone number

The profile update process is:

```text
User changes profile
      ↓
Select profile image
      ↓
Upload image to Cloudinary
      ↓
Get Cloudinary URL
      ↓
Update Firestore user document
```

The user document is updated with:

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

The application uses custom React Hooks to separate reusable business logic from UI components.

## `useAuth`

Provides the currently authenticated Firebase user.

---

## `useChats`

Responsible for:

* Getting the current user's chats
* Listening for chat updates
* Loading state
* Error handling

---

## `useMessages`

Responsible for:

* Subscribing to messages
* Loading messages
* Handling errors
* Real-time updates

---

## `useSendMessage`

Responsible for sending messages to Firestore.

Example:

```js
sendMessage(chat, userId, messageData)
```

---

## `useCreateChat`

Responsible for creating or opening a conversation between two users.

---

## `useSearchUsers`

Responsible for searching users by their name.

---

## `useAudioRecorder`

Responsible for:

* Starting recording
* Stopping recording
* Managing `MediaRecorder`
* Creating the audio Blob
* Managing recording state

---

## `useSendAudioMessage`

Responsible for:

```text
Audio Blob
    ↓
Cloudinary
    ↓
Audio URL
    ↓
Firestore
```

---

## `useUploadAttachment`

Responsible for:

* Image uploads
* Video uploads
* File uploads
* Cloudinary communication
* Loading state
* Error handling

---

## `useMarkMessagesSeen`

Responsible for marking received messages as:

```js
status: "seen"
```

when the user opens the conversation.

---

## `usePresence`

Responsible for tracking another user's online/offline status.

---

## `useBlockUser`

Responsible for:

* Blocking users
* Unblocking users
* Loading state
* Error handling

---

## `useBlockStatus`

Responsible for checking the relationship between the current user and the other user.

It returns:

```js
{
  blockedByMe,
  blockedMe
}
```

This allows the UI to display the correct message.

---

# 🧩 Services Layer

The project separates Firebase and Cloudinary operations into service files.

Architecture:

```text
Components
     ↓
Custom Hooks
     ↓
Services
     ↓
Firebase / Cloudinary
```

This makes the application easier to maintain and reduces duplicated code.

---

# 📁 Project Structure

A simplified structure:

```text
src/
│
├── assets/
│   └── avatar.webp
│
├── Components/
│   ├── AttachmentMenu/
│   ├── ChatMessage/
│   ├── ChatList/
│   ├── ChatItem/
│   ├── Navbar/
│   ├── Settings/
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
│   ├── useUpdateProfile
│   ├── useBlock
│   └── useBlockStatus
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

# 🔐 Authentication Flow

Registration:

```text
User enters information
        ↓
Firebase Authentication
        ↓
createUserWithEmailAndPassword()
        ↓
Firebase creates account
        ↓
Create users/{uid}
        ↓
User enters application
```

Login:

```text
Email + Password
       ↓
Firebase Authentication
       ↓
onAuthStateChanged()
       ↓
AuthContext
       ↓
Current user available
       ↓
Chat application
```

---

# 🚪 Logout Flow

```text
Click Logout
     ↓
signOut(auth)
     ↓
Firebase authentication state changes
     ↓
AuthContext receives null user
     ↓
Application stops showing authenticated content
     ↓
User returns to Login
```

---

# 📨 Sending Text Message

```text
User writes message
       ↓
ChatMessage
       ↓
useSendMessage
       ↓
MessagesService
       ↓
Firestore
       ↓
onSnapshot()
       ↓
Message appears in real time
```

---

# 🎤 Sending Audio

```text
Click microphone
       ↓
MediaRecorder
       ↓
Audio Blob
       ↓
useSendAudioMessage
       ↓
Cloudinary
       ↓
Audio URL
       ↓
Firestore
       ↓
onSnapshot()
       ↓
Audio appears in chat
```

---

# 📎 Sending Attachment

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
onSnapshot()
    ↓
Attachment appears
```

---

# 🔎 Searching Inside a Conversation

```text
Click Search
      ↓
Search input appears
      ↓
User enters keyword
      ↓
Current messages are checked
      ↓
Messages containing keyword are found
      ↓
Matching keyword is highlighted
```

---

# 🚫 Blocking a User

```text
User A clicks Block
       ↓
useBlockUser
       ↓
blockUser()
       ↓
User A:
blockedUser → User B
       ↓
User B:
blockedBy → User A
       ↓
useBlockStatus()
       ↓
User A sees:
"You blocked this user."

User B sees:
"You are blocked by this user."
       ↓
Both users cannot send messages
```

---

# 🟢 Presence Flow

```text
User opens application
       ↓
Firebase Realtime Database
       ↓
status/{uid}
       ↓
state = online
       ↓
Other user sees "Online"
```

When disconnected:

```text
Connection lost
      ↓
onDisconnect()
      ↓
state = offline
      ↓
lastChanged updated
      ↓
Other user sees "Last seen..."
```

---

# 🧠 Design Principles

## Separation of Concerns

Components are mainly responsible for rendering UI.

Custom hooks contain reusable application logic.

Services contain Firebase and Cloudinary operations.

---

## Reusable Services

Firebase operations are centralized instead of being repeated inside every component.

---

## Custom Hooks

Hooks provide reusable logic for:

* Authentication
* Chats
* Messages
* Search
* Uploads
* Presence
* Blocking
* Profile management

---

## Real-Time Architecture

The application uses Firestore listeners so that data changes are reflected immediately.

This is especially important for:

* New messages
* Message status
* Seen messages
* Chat updates
* Blocking state

---

# 🛠️ Technologies

| Technology                 | Purpose                        |
| -------------------------- | ------------------------------ |
| React                      | Frontend UI                    |
| Vite                       | Development and build tool     |
| JavaScript                 | Application logic              |
| CSS Modules                | Component styling              |
| Firebase Authentication    | User authentication            |
| Cloud Firestore            | Users, chats, and messages     |
| Firebase Realtime Database | Online presence                |
| Cloudinary                 | Media and file storage         |
| React Hooks                | State and lifecycle management |
| Custom Hooks               | Business logic separation      |
| React Hook Form            | Form handling                  |
| React Toastify             | Notifications                  |
| Font Awesome               | Icons                          |

---

# 🌐 Environment Variables

Create a `.env` file in the project root:

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

Never commit real credentials or private configuration values to GitHub.

---

# 🚀 Installation

Clone the repository:

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

Create:

```text
.env
```

and add the Firebase and Cloudinary configuration.

---

# ▶️ Running the Project

Start the development server:

```bash
npm run dev
```

The application will be available at a URL similar to:

```text
http://localhost:5173
```

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# ⚠️ Important Notes

## Cloudinary

The application does **not** use Firebase Storage.

Cloudinary stores:

* Images
* Videos
* Audio
* Files

Firestore stores only their URLs.

---

## Firestore Indexes

Some Firestore queries may require composite indexes.

For example:

```text
members
updatedAt
```

If Firestore reports that an index is required, create the suggested index from the Firebase Console.

---

## HEIC Images

Some browsers do not display `.heic` images directly.

For profile pictures and chat images, HEIC files may need to be converted to browser-compatible formats such as:

```text
JPG
WebP
PNG
```

---

# 📚 Main Technologies Summary

| Technology                 | Purpose                         |
| -------------------------- | ------------------------------- |
| React                      | User interface                  |
| Vite                       | Development environment         |
| Firebase Authentication    | Register / Login / Logout       |
| Firestore                  | Users / Chats / Messages        |
| Firebase Realtime Database | Online Presence                 |
| Cloudinary                 | Images / Videos / Audio / Files |
| Custom Hooks               | Reusable business logic         |
| Context API                | Authentication state            |
| CSS Modules                | Styling                         |
| React Hook Form            | Forms                           |
| React Toastify             | Notifications                   |
| Font Awesome               | Icons                           |

---

# 🎯 Project Goal

The goal of this project is to build a complete real-time private messaging application while applying modern frontend development concepts.

The project demonstrates:

* Component-based architecture
* React Hooks
* Custom Hooks
* Context API
* Firebase Authentication
* Firebase Firestore
* Firebase Realtime Database
* CRUD operations
* Real-time listeners
* Message status management
* Unread message counters
* Conversation search
* User search
* User blocking and unblocking
* Cloudinary media uploads
* Browser Media APIs
* File handling
* Online presence
* Profile management
* Service-layer architecture
* Separation of concerns
* Real-time application state

---

This project was created for educational and development purposes.
