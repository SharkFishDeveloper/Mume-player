# Mume – Music Streaming App

**Apk in realeases on GITHUB**

A modern music streaming application built with **React Native (Expo)** and the **JioSaavn public API**. This project emphasizes clean architecture, predictable state management, and a polished UI based on the provided Figma design reference.

---

##  Features

### Core Functionality
* **Search** – Search songs, artists, and albums using JioSaavn API.
* **Song Playback** – Play/pause, next track, queue management.
* **Queue Management** – Add songs to queue with local persistence.
* **Favourites** – Add/remove favourite songs stored via `AsyncStorage`.
* **Playlists** – Create and manage playlists locally.
* **Shuffle Mode** – Shuffle playback support.
* **Theme Switching** – Dark/light theme management using **Zustand**.
* **Artist & Album Views** – Browse artist songs and album collections.
* **Mini Player** – Persistent player synced with playback state.

---

##  Architecture
The app follows a **feature-first architecture** with centralized global state management.

### State Management
State is managed using **Zustand** for simplicity and performance.

**Global Stores:**
* **Player Store:** Current song, play/pause, playback status.
* **Queue Store:** Song queue, shuffle support.
* **Theme Store:** Dark/light mode toggle.
* **Favourites:** Persisted using `AsyncStorage`.
* **Playlists:** Persisted using `AsyncStorage`.

> **Note:** Zustand was chosen over Redux to reduce boilerplate while maintaining predictable and readable state.

### Storage
`AsyncStorage` is used for:
* Favourites
* Playlists
* Queue persistence

*All content is fetched from the live API with no mock data.*

---

##  API
**JioSaavn Public API**
* **Base URL:** `https://saavn.sumit.co/`
* **Documentation:** [saavn.sumit.co/docs](https://saavn.sumit.co/docs)
* **Auth:** No API key required.

### Endpoints
* **Search:** `GET /api/search`, `/api/search/songs`, `/api/search/albums`, `/api/search/artists`, `/api/search/playlists`
* **Songs:** `GET /api/songs/{id}`, `/api/songs/{id}/suggestions`
* **Artists:** `GET /api/artists/{id}`, `/api/artists/{id}/songs`, `/api/artists/{id}/albums`

---

##  UI & Design
* Based on the [Figma design reference](https://www.figma.com/design/jm3TbqEdkR15QNVDE4rSlX/Lokal---Music-Player-App-UI-Kit-Sample).
* Clean, minimal layout with an **Orange accent color** for brand identity.
* Supports **Responsive layouts** and **Dark mode**.

---

##  Technical Challenges

### Background Playback
Player state persists independently of navigation. The Mini player and full player share the same Zustand store to ensure seamless transitions.

### State Synchronization
A single source of truth for playback state ensures that the queue, current song, and play/pause status remain synced between different UI components.
*Note: Full background playback is limited in Expo Go. Native builds (APK) support advanced playback behavior.*

---

##  Tech Stack
* **Framework:** React Native (Expo)
* **Language:** TypeScript
* **Navigation:** React Navigation v6+
* **State Management:** Zustand
* **Storage:** AsyncStorage
* **Audio Engine:** Expo AV

---

##  Setup & Installation

### Prerequisites
* Node.js ≥ 18
* Expo CLI
* Android Studio/Emulator or physical device

### Installation & Start
```bash
# Install dependencies
npm install

# Start Expo
npx expo start

# Run on Android
npx expo run:android

npx expo prebuild
npx expo run:android
```


##  Submission Details
This submission includes:
* **GitHub repository**
* **APK File**
* **README documentation**
* **Demo video** (2-3 minutes)

---

##  Future Improvements
* **Full background playback** using **native** modules.
* **Offline downloads** for local playback.
* **Repeat modes** (Repeat One/All).
* **Enhanced player transition animations** for a smoother feel.
* **Improved dark mode** theming and deeper customization.

---

**Author:** Shahz  
* **Demo video** - https://drive.google.com/file/d/1QEr_SkzzVVWXmLRW3ZvjzQ-kIzQOWcMm/view
* **Apk** - On Github release
* *Built as part of a React Native music streaming assignment. Focus on correctness, architecture, and user experience.*
