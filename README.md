# 💬 Real-Time Chat Application

A modern real-time private chat application built with **React + Vite**, **Firebase Authentication**, **Cloud Firestore**, **Firebase Realtime Database**, and **Cloudinary**.

The application supports real-time one-to-one conversations, text messages, voice messages, images, videos, files, message status tracking, message details, message deletion, online presence, unread message counters, user search, conversation search, user blocking, profile management, media uploads, and logout functionality.

---

# 📌 Table of Contents

* [Features](#-features)
* [Technologies](#-technologies)
* [Project Architecture](#-project-architecture)
* [Project Structure](#-project-structure)
* [Authentication](#-authentication)
* [Logout](#-logout)
* [Chat](#-chat)
* [Text Messages](#-text-messages)
* [Voice Messages](#-voice-messages)
* [Attachments](#-attachments)
* [Message Status](#-message-status)
* [Message Details](#-message-details)
* [Message Deletion](#-message-deletion)
* [Unread Messages](#-unread-messages)
* [Conversation Search](#-conversation-search)
* [User Search](#-user-search)
* [Block and Unblock Users](#-block-and-unblock-users)
* [Online Presence](#-online-presence)
* [Profile Settings](#-profile-settings)
* [Cloudinary Uploads](#-cloudinary-uploads)
* [Firestore Database](#-firestore-database)
* [Custom Hooks](#-custom-hooks)
* [Services Layer](#-services-layer)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Running the Project](#-running-the-project)
* [Production Build](#-production-build)
* [How the Application Works](#-how-the-application-works)
* [Design Principles](#-design-principles)
* [Future Improvements](#-future-improvements)
* [Project Goal](#-project-goal)

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

## 🚪 Logout

* Firebase logout
* Authentication state reset
* Automatic return to login screen

## 💬 Private Chat

* One-to-one conversations
* Creating new chats
* Real-time messages
* Last message preview
* Chat ordering by latest activity
* Automatic scrolling to the latest message
* Real-time chat updates

## 📝 Text Messages

* Send text messages
* Display sent and received messages differently
* Message timestamps
* Message status indicators
* Search and highlight text inside conversations

## 🎤 Voice Messages

* Browser microphone access
* Start and stop recording
* MediaRecorder API
* Audio Blob creation
* Cloudinary upload
* Firestore URL storage
* Audio playback

## 📎 Attachments

Supported:

* 🖼️ Images
* 🎥 Videos
* 📄 Files
* 🎤 Audio

Media files are uploaded to Cloudinary while Firestore stores their URLs.

## 👁️ Message Status

Messages follow:

```text
sent → delivered → seen
```

The interface displays:

```text
✓   Sent
✓✓  Delivered
✓✓  Seen
```

## 🗑️ Message Deletion

Users can delete their messages according to their status.

* **Delete for me** removes the message from the current user's view.
* **Delete for everyone** is available only before the receiver sees the message.
* Once a message becomes `seen`, it can no longer be deleted for everyone.
* Deleted-for-everyone messages remain as a placeholder instead of completely disappearing.
* The placeholder identifies who deleted the message.

Examples:

```text
You deleted this message
```

or:

```text
User deleted this message
```

## ℹ️ Message Details

Each sent message has an information menu.

The user can open:

```text
Message info
```

to see details such as:

* When the message was sent
* Message status
* Delivery time
* Seen time
* Message type
* Deletion information when applicable

The information menu can be toggled by clicking the information icon again.

## 🔢 Unread Messages

* Unread message counting
* Real-time unread counter
* Messages are marked as seen when the receiver opens the conversation
* Counter disappears after messages are marked as seen

## 🔎 Conversation Search

* Search inside the currently selected conversation
* Search text messages
* Highlight matching text
* Search works with already-loaded messages

## 👤 User Search

* Search users by name
* Normalized `searchName`
* Firestore range queries
* Create/open a conversation directly from search results

## 🚫 Block and Unblock

* Block users
* Unblock users
* Real-time block state
* Prevent blocked users from sending messages
* Display appropriate block messages

## 🟢 Online Presence

* Online/offline state
* Last seen
* Firebase Realtime Database
* `onDisconnect()` support

## 👤 Profile Management

Users can update:

* Profile picture
* Name
* Phone number

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

# 🏗️ Project Architecture

The application follows a layered architecture:

```text
Components
     ↓
Custom Hooks
     ↓
Services
     ↓
Firebase / Cloudinary
```

### Components

Responsible mainly for:

* Rendering UI
* Handling user interaction
* Displaying data

### Custom Hooks

Responsible for:

* Reusable business logic
* State management
* Loading states
* Error handling
* Connecting components to services

### Services

Responsible for:

* Firestore operations
* Firebase Authentication operations
* Realtime Database operations
* Cloudinary uploads

This separation keeps the application modular and easier to maintain.

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
│   ├── MessageDetails/
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
│   ├── useDeleteMessage
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

# 🔐 Authentication

Firebase Authentication is used for account registration and login.

## Registration Flow

```text
User enters information
        ↓
createUserWithEmailAndPassword()
        ↓
Firebase creates account
        ↓
Create users/{uid}
        ↓
User enters application
```

## Login Flow

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

# 🚪 Logout

Users can securely log out using Firebase Authentication:

```js
signOut(auth);
```

The flow is:

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

---

# 💬 Chat

The application supports private one-to-one conversations.

A chat contains the IDs of both participants:

```js
{
  members: ["user1", "user2"],
  lastMessage: "Hello!",
  updatedAt: Timestamp
}
```

The `updatedAt` field is used to order conversations according to their latest activity.

The `lastMessage` field displays a preview in the chat list.

---

# 📝 Text Messages

A text message is stored as:

```js
{
  type: "text",
  text: "Hello!",
  fileURL: null,
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent",
  deliveredAt: null,
  seenAt: null
}
```

Messages are stored in:

```text
Chat/{chatId}/messages
```

---

# 🎤 Voice Messages

Voice messages use the browser's `MediaRecorder` API.

The process is:

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

Example:

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

# 📎 Attachments

Users can send:

```text
Image
Video
File
Audio
```

The application uses Cloudinary for actual file storage.

Firestore stores only the URL.

---

# 👁️ Message Status

Each message has a status:

```text
sent → delivered → seen
```

## Sent

The message has been created successfully:

```js
status: "sent"
```

## Delivered

The receiver has received the message:

```js
status: "delivered"
```

## Seen

The receiver opened the conversation and viewed the message:

```js
status: "seen"
```

The timestamps are also stored:

```js
deliveredAt: Timestamp
seenAt: Timestamp
```

---

# ℹ️ Message Details

Each sent message has an information icon.

Clicking it opens a message menu:

```text
ⓘ
  ↓
Message info
Delete for me
Delete for everyone
```

The menu is controlled using React state.

For example:

```js
const [selectedMenuMessage, setSelectedMenuMessage] = useState(null);
```

Clicking the information icon again closes the menu:

```js
onClick={() =>
  setSelectedMenuMessage(
    selectedMenuMessage === message.id
      ? null
      : message.id
  )
}
```

This allows the menu to work as a toggle without requiring the user to choose an action.

---

# 🕒 Message Information

The message details component can display information such as:

```text
Message Information

Type:
Text

Sent:
10:32 AM

Delivered:
10:32 AM

Seen:
10:35 AM
```

The application uses the timestamps stored with the message.

Important fields:

```js
createdAt
deliveredAt
seenAt
status
```

---

# 🗑️ Message Deletion

The application supports two different deletion operations:

```text
Delete for me
Delete for everyone
```

---

## Delete for Me

Delete for me means that the message is hidden only from the current user's view.

The message is not removed from Firestore.

Instead, the user's ID is added to:

```js
deletedFor
```

Example:

```js
{
  deletedFor: ["user1"]
}
```

The service uses:

```js
arrayUnion(userId)
```

to add the current user's ID.

Conceptually:

```text
User clicks Delete for me
        ↓
Add current UID to deletedFor
        ↓
Firestore message remains
        ↓
Current user no longer sees it
        ↓
Other user can still see it
```

---

## Delete for Everyone

Delete for everyone is only allowed while the receiver has not seen the message.

The rule is:

```text
status !== "seen"
```

If the message has already been seen:

```text
Delete for everyone
       ↓
Not allowed
```

If it has not been seen:

```text
Delete for everyone
       ↓
Allowed
       ↓
Message content is removed
       ↓
Deleted placeholder remains
       ↓
Both users see the placeholder
```

---

## Deleted Message Data

A message deleted for everyone can contain:

```js
{
  deletedForEveryone: true,
  deletedBy: "userId",
  text: null,
  fileURL: null
}
```

The `deletedBy` field identifies who deleted the message.

---

## Deleted Message UI

Instead of displaying the original content, the application displays:

```text
🚫 You deleted this message
```

when the current user deleted it.

For the other participant:

```text
🚫 User deleted this message
```

The application checks:

```js
message.deletedBy === currentUser?.uid
```

to determine which message should be displayed.

---

# 🔄 Message Deletion Flow

## Delete for Me

```text
User clicks message menu
        ↓
Delete for me
        ↓
useDeleteMessage
        ↓
deleteMessageForMe()
        ↓
Add userId to deletedFor
        ↓
Message stays in Firestore
        ↓
Current user hides the message
```

## Delete for Everyone

```text
User clicks message menu
        ↓
Check message status
        ↓
Is status "seen"?
     ↙       ↘
   YES        NO
    ↓          ↓
Delete       Delete
for me       for everyone
               ↓
        deletedForEveryone
               ↓
          deletedBy
               ↓
       Remove message content
               ↓
      Show deleted placeholder
```

---

# 🔢 Unread Messages

Unread messages are determined using message status.

Messages that have:

```js
status: "seen"
```

are not counted as unread.

The application listens for changes in real time.

Flow:

```text
New message
     ↓
status = sent
     ↓
Receiver has unread message
     ↓
Unread counter appears
     ↓
Receiver opens conversation
     ↓
markMessagesAsSeen()
     ↓
status = seen
     ↓
Unread counter disappears
```

---

# 🔎 Conversation Search

The application supports searching inside the currently selected conversation.

Flow:

```text
Click Search
      ↓
Search input appears
      ↓
User enters keyword
      ↓
Loaded messages are filtered
      ↓
Matching text is highlighted
```

Example conversation:

```text
Hello Aprar
How are you?
Are you ready?
```

Searching:

```text
Hello
```

highlights the matching word.

The search uses:

```js
message.text?.toLowerCase().includes(
  searchText.toLowerCase()
)
```

---

# 👤 User Search

Users can search for other users by name.

Each user has a normalized:

```js
searchName
```

field.

Example:

```js
{
  Name: "Aprar Ismail",
  searchName: "aprar ismail"
}
```

The application uses Firestore range queries:

```js
where("searchName", ">=", search)
where("searchName", "<=", search + "\uf8ff")
```

Flow:

```text
User types name
      ↓
useSearchUsers()
      ↓
Firestore query
      ↓
Matching users
      ↓
Display results
      ↓
Click user
      ↓
Create/Open chat
```

---

# 🚫 Block and Unblock Users

The application supports blocking users.

When User A blocks User B:

```text
User A
  ↓
blocks User B
  ↓
User A cannot send messages
User B cannot send messages
```

User A sees:

```text
You blocked this user.
You can't send messages.
```

User B sees:

```text
You are blocked by this user.
You can't send messages.
```

---

# 🧱 Block Data

The user document contains:

```js
{
  blockedUser: []
}
```

and:

```js
{
  blockedBy: []
}
```

Example:

```js
{
  blockedUser: ["userB"],
  blockedBy: []
}
```

The blocked user can contain:

```js
{
  blockedUser: [],
  blockedBy: ["userA"]
}
```

---

# 🔓 Unblock

Unblocking removes the corresponding IDs.

Flow:

```text
User A clicks Unblock
        ↓
Remove User B from blockedUser
        ↓
Remove User A from blockedBy
        ↓
Both users can communicate again
```

---

# 🟢 Online Presence

Firebase Realtime Database is used for online presence.

The status is stored under:

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

Firebase `onDisconnect()` is used to update the status when the connection is lost.

---

# 👤 Profile Settings

Users can update:

* Profile picture
* Name
* Phone number

The process is:

```text
User changes profile
      ↓
Select profile image
      ↓
Upload image to Cloudinary
      ↓
Get Cloudinary URL
      ↓
Update Firestore
```

Example:

```js
{
  Name: data.name,
  searchName: data.name.toLowerCase(),
  number: data.number,
  photoURL: data.photoURL
}
```

---

# ☁️ Cloudinary Uploads

The application does **not use Firebase Storage**.

Cloudinary is responsible for:

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

Firestore stores the URL instead of the actual media file.

---

# 🗄️ Firestore Database

Cloud Firestore is the primary database.

The main collections are:

```text
users
Chat
```

---

# 👤 Users Collection

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

The `members` array contains the two participants.

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

A complete text message can contain:

```js
{
  type: "text",
  text: "Hello!",
  fileURL: null,
  senderId: "userId",
  createdAt: Timestamp,
  status: "sent",
  deliveredAt: null,
  seenAt: null,
  deletedFor: [],
  deletedForEveryone: false,
  deletedBy: null
}
```

---

# 📊 Message Data Model

| Field                | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `type`               | Message type                                |
| `text`               | Text content                                |
| `fileURL`            | Cloudinary media URL                        |
| `senderId`           | Sender's UID                                |
| `createdAt`          | Message creation time                       |
| `status`             | `sent`, `delivered`, or `seen`              |
| `deliveredAt`        | Time receiver received message              |
| `seenAt`             | Time receiver viewed message                |
| `deletedFor`         | Users who deleted message for themselves    |
| `deletedForEveryone` | Whether message was deleted for everyone    |
| `deletedBy`          | UID of the user who deleted it for everyone |

---

# 🔄 Realtime Messaging

Firestore `onSnapshot()` is used for real-time updates.

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

When a new message is added:

```text
Firestore
    ↓
onSnapshot()
    ↓
React state updates
    ↓
Component re-renders
    ↓
Message appears immediately
```

No page refresh is required.

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

# 🚫 Blocking Flow

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
Both users cannot send messages
```

---

# 🟢 Presence Flow

When a user opens the application:

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

# 🪝 Custom Hooks

The application uses custom React Hooks to separate reusable logic from UI components.

## `useAuth`

Provides the currently authenticated Firebase user.

---

## `useChats`

Responsible for:

* Getting current user's chats
* Listening for chat updates
* Loading state
* Error handling

---

## `useMessages`

Responsible for:

* Subscribing to messages
* Loading messages
* Handling errors
* Real-time message updates

---

## `useSendMessage`

Responsible for sending messages.

Example:

```js
sendMessage(chat, userId, messageData)
```

---

## `useCreateChat`

Responsible for creating or opening a conversation between two users.

---

## `useSearchUsers`

Responsible for searching users by name.

---

## `useAudioRecorder`

Responsible for:

* Starting recording
* Stopping recording
* Managing MediaRecorder
* Creating audio Blob
* Recording state

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

Responsible for changing received messages from:

```js
status: "delivered"
```

to:

```js
status: "seen"
```

when the user opens the conversation.

---

## `useDeleteMessage`

Responsible for message deletion.

It provides:

```js
deleteForMe()
deleteForEveryone()
```

### Delete for me

Updates:

```js
deletedFor: arrayUnion(userId)
```

### Delete for everyone

Checks:

```text
Is the current user the sender?
        ↓
Has the receiver seen the message?
        ↓
If not seen → allow deletion
If seen → reject deletion
```

Then updates the message:

```js
{
  deletedForEveryone: true,
  deletedBy: userId,
  text: null,
  fileURL: null
}
```

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

Returns:

```js
{
  blockedByMe,
  blockedMe
}
```

---

## `useUser`

Responsible for retrieving user information such as:

* Name
* Email
* Profile picture
* Phone number
* Block information

---

## `useUpdateProfile`

Responsible for updating profile information.

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

Example services:

### `MessagesService.js`

Responsible for:

* Subscribe to messages
* Create messages
* Mark messages as delivered
* Mark messages as seen
* Count unread messages
* Delete messages for the current user
* Delete messages for everyone

### `ChatServices.js`

Responsible for:

* Creating chats
* Getting user chats
* Subscribing to chat updates
* Updating last message information

### `userService.js`

Responsible for:

* Getting users
* Searching users
* Updating profile information
* Blocking and unblocking users

### `firebase_firestore.js`

Contains reusable Firestore operations such as:

```text
Add
Set
Update
Get
Delete
Subscribe
```

### `uploadFile.js`

Responsible for uploading files to Cloudinary and returning the uploaded URL.

---

# 🔐 Environment Variables

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

Never commit real secrets or private configuration values to GitHub.

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

The application will be available at:

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

Firestore stores their URLs.

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

For profile pictures and chat images, HEIC files may need to be converted into browser-compatible formats such as:

```text
JPG
WebP
PNG
```

---

# 🧠 Design Principles

## Separation of Concerns

Components are mainly responsible for rendering UI.

Custom hooks contain reusable application logic.

Services contain Firebase and Cloudinary operations.

---

## Reusable Services

Firebase operations are centralized instead of being repeated throughout components.

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
* Message deletion

---

## Real-Time Architecture

The application uses Firebase listeners so that changes are reflected immediately.

This is especially important for:

* New messages
* Message status
* Seen messages
* Unread counters
* Chat updates
* Blocking state
* Online presence
* Message deletion

---

# 🔄 Complete Application Flow

## User Registration

```text
Sign Up
   ↓
Firebase Authentication
   ↓
Create user account
   ↓
Create users/{uid}
   ↓
AuthContext
   ↓
Chat application
```

## User Login

```text
Login
   ↓
Firebase Authentication
   ↓
onAuthStateChanged()
   ↓
AuthContext
   ↓
Current User
   ↓
Chat
```

## Send Message

```text
ChatMessage
   ↓
useSendMessage
   ↓
MessagesService
   ↓
Firestore
   ↓
onSnapshot
   ↓
Both users receive update
```

## Message Delivery

```text
Message created
   ↓
status = sent
   ↓
Receiver receives message
   ↓
status = delivered
   ↓
Receiver opens chat
   ↓
status = seen
```

## Message Deletion

```text
Message Menu
     ↓
     ├── Message Info
     │
     ├── Delete for me
     │      ↓
     │   deletedFor
     │
     └── Delete for everyone
            ↓
       Check status
            ↓
       Not seen?
        ↙       ↘
      YES        NO
       ↓          ↓
   Delete for    Delete
   everyone      for me
       ↓
 deletedForEveryone
       ↓
 deletedBy
       ↓
 Placeholder displayed
```

---

# 📚 Main Technologies Summary

| Technology                 | Purpose                         |
| -------------------------- | ------------------------------- |
| React                      | User interface                  |
| Vite                       | Development environment         |
| Firebase Authentication    | Register / Login / Logout       |
| Cloud Firestore            | Users / Chats / Messages        |
| Firebase Realtime Database | Online Presence                 |
| Cloudinary                 | Images / Videos / Audio / Files |
| Custom Hooks               | Reusable business logic         |
| Context API                | Authentication state            |
| CSS Modules                | Styling                         |
| React Hook Form            | Forms                           |
| React Toastify             | Notifications                   |
| Font Awesome               | Icons                           |
| MediaRecorder API          | Voice recording                 |

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
* Message delivery tracking
* Seen message tracking
* Unread message counters
* Message details
* Message deletion
* Delete for me
* Delete for everyone
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

# 🔮 Future Improvements

Possible future improvements include:

* Message reactions
* Reply to messages
* Forward messages
* Edit messages
* Typing indicators
* Push notifications
* Group chats
* Message pagination
* Infinite scrolling
* Improved file previews
* Image compression before upload
* Message read receipts for group conversations
* Better media management
* End-to-end encryption
* Message expiration
* Voice message waveform visualization
* Improved mobile responsiveness
* Message context menus
* Message selection and bulk deletion

---

# 📌 Important Implementation Rules

### Message status

```text
sent → delivered → seen
```

### Delete for everyone

Allowed only when:

```js
message.status !== "seen"
```

### Delete for me

Always available for the user's own messages and hides the message only from that user.

### Deleted-for-everyone message

The original content is removed, but the message document remains so both participants can see a placeholder.

Example:

```text
You deleted this message
```

or:

```text
User deleted this message
```

### Media

Actual media is stored in Cloudinary.

Firestore stores the media URL.

### Real-time updates

Firestore `onSnapshot()` is used whenever real-time updates are required.

---

# 📄 License

This project was created for educational and development purposes.
