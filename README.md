<p align="center">
  <a href="#"><img src="src/assets/azurejay.png" height="250" /></a>
  <br/>
  <font size="6"><b>AzureJay App</b></font>
  <br/>
  <em>An AI tutor to help you sound more natural when speaking English</em>
  <br/><br/>
  <a href="#"><img src="https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Nativewind-06B6D4?logo=tailwindcss&logoColor=white" /></a>
</p>

<hr/>

## About

AzureJay, represented by an Atlantic Bird mascot, is a conversational language learning app designed to provide an efficient learning experience through AI-powered interactions. The app uses a Supervisor architecture with multiple specialized agents to detect grammar and vocabulary errors, gather contextual information, and provide corrections and explanations. The primary focus is helping users make their English responses sound more natural and fluent.

## Features

- **MVVM Architecture:** Clean separation of concerns for maintainability and scalability.
- **TypeScript Support:** Ensures type safety across the codebase.
- **AI-Powered Tutor:** Meet Rachel, your conversational AI tutor for immersive English practice
- **Voice-first Interface:** Natural conversation practice through audio recording
- **Natural Speaking Coaching:** AI-powered corrections that transform your English into more natural, fluent expressions as native speakers would say
- **Grammar Analysis:** Feedback on grammar improvements
- **Conversation Management:** Organize and revisit past conversations with full transcription

## Project Structure

```
src/
  app/                # App entry and layout
  shared/
    api/              # API layer
    interfaces/       # TypeScript interfaces and types
    services/         # Business logic and data fetching
    utils/            # Utility functions
  viewModels/
    Home/             # Home screen MVVM components
    Auth/             # Authentication flow
    Settings/         # User preferences
    Transcription/    # Conversation review
   components/        # Shared UI components
    ui/               # Reusable design
    guards/           # Route protection
```


## Libraries & Tools

- **React Native**: UI framework for building native apps
- **Expo**: Toolchain for React Native development
- **@tanstack/react-query**: Data fetching and caching
- **Axios**: HTTP client for API requests
- **TypeScript**: Static type checking
- **Nativewind**: Tailwind CSS for React Native styling
- **expo-audio**: High-quality audio recording and playback
- **react-native-gesture-handler**: Touch gesture recognition

## Architectural Patterns

- **MVVM (Model-View-ViewModel):**
  - `model.tsx` files: Contain state management and business logic
  - `view.tsx` files: Presentational components, receive data and actions via props
  - Shared services and utilities for API and data formatting
- **Separation of Concerns:**
  - API, services, interfaces, and utilities are modularized
  - Components are organized by feature and responsibility

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
3. **Run on device or emulator:**
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`

## Scripts

- `npm start` — Start Expo development server
- `npm run android` — Run on Android device/emulator
- `npm run ios` — Run on iOS device/simulator
- `npm run web` — Run in web browser

## License

AzureJay is licensed under the AGPL-3.0 license.