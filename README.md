# 🏋️ Three-Screen Workout Tracker – React Native (Expo)

This is a mobile workout tracker app built with **React Native (Expo)** as part of a take-home assignment. It fulfills all core requirements, along with an additional **Dark Mode toggle** for a better user experience.

---

## ✅ Features Implemented

### 🚀 Core Requirements (from PDF brief)
- **Authentication screen** (email + password)
  - Stores securely on device using `expo-secure-store`
- **Home screen**
  - Lists 3 hard-coded workouts
- **Workout detail screen**
  - Displays exercises with a timer
  - Auto-advances to next exercise
- **History screen**
  - Stores completed workouts locally using `AsyncStorage`
  - Renders a simple list of past workouts

### ✨ Additional Feature
- **Dark Mode toggle**
  - Global context using `ThemeContext`
  - Switch between light and dark themes across all screens

---

## 🛠 Tech Stack

- **React Native (Expo)**
- **React Navigation**
- **expo-secure-store** for secure auth
- **AsyncStorage** for local persistence
- **Context API** for theme management
- **TypeScript** (optional depending on setup)

---

## 📦 Setup & Run

1. Clone the repo:
   ```bash
   git clone https://github.com/akashjha21/Workout_Tracker.git
   cd Workout_Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npx expo start
   ```

4. Scan the QR code to open in Expo Go (or run on Android/iOS simulator).

---

## 📸 Screenshots

> Include 2–5 screenshots or a short GIF here showing:
- Auth screen
- Workout list
- Timer in action
- History list
- Dark Mode toggle

---

## 🧪 Tests

Basic unit tests added using Jest (optional based on your scope).

---

## 📝 What I'd Do Next (If More Time)

- Add animated transitions between exercises
- Add Voice TTS
- Integrate voice cues using `expo-speech`
- Export workout history to calendar or fitness APIs
- Display weekly calendar view in history
- Add workout editing/tagging capabilities

---

## ⏱ Time Spent

> Approximately **7–8 hours** total, including setup, coding, styling, dark mode enhancement, and a lot of debugging for errors.
