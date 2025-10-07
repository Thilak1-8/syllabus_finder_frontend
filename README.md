# Syllabus Finder Frontend

## Overview

Students often struggle to find structured, high-quality online resources that align with their university syllabus. Manual searching on platforms like YouTube is time-consuming and frequently leads to irrelevant or unstructured content. **Syllabus Finder** solves this by offering a personalized, AI-driven learning experience that suggests syllabus-specific educational videos in a structured, topic-wise sequence.

---

## Features

- **Syllabus Upload & Processing:** Upload your syllabus (PDF, DOCX, TXT) and the system automatically extracts relevant topics.
- **YouTube Video Retrieval:** Leveraging the YouTube Data API, the app fetches educational videos tailored to each syllabus topic.
- **Language-Based Filtering:** Select your preferred language for video explanations to ensure a personalized learning experience.
- **Structured Sequencing:** Videos are organized in the same order as your syllabus for systematic learning.
- **User Preferences & Smart Sorting:** Results can be sorted by views, duration, and relevance.
- **Caching & Recommendations:** Backend stores data to improve performance and recommend content.

---

## Why Syllabus Finder?

Traditional methods and platforms are limited:
- **Manual Searching (Google, YouTube):** Unstructured, time-consuming.
- **Online Courses (Coursera, Udemy, Khan Academy):** Fixed syllabus, not flexible for university curricula.
- **AI-Based Tools (ChatGPT, EdX, Duolingo):** General knowledge, not syllabus-specific.

**Limitations Overcome:**
- ✅ Automatic syllabus-based video retrieval
- ✅ Language-based video filtering
- ✅ Structured, topic-wise sequencing of learning content

---

## Tech Stack

### Frontend
- **React.js:** Interactive user interface
- **Axios:** Handling API requests

### Backend
- **Node.js + Express.js:** Server and API endpoints
- **MongoDB:** Database for caching and personalized recommendations

### APIs & AI Integration
- **YouTube Data API:** Fetches relevant educational videos

---

## How It Works

1. **Upload Syllabus:** PDF, DOCX, or TXT format accepted.
2. **Topic Extraction:** AI processes syllabus to extract topics.
3. **Video Search:** Retrieves relevant YouTube videos for each topic.
4. **Language Filtering:** Filters video results by user’s preferred explanation language.
5. **Structured Results:** Organizes videos in syllabus sequence.
6. **Smart Sorting:** Users can sort by views, duration, or relevance.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- YouTube Data API Key (for backend integration)

### Installation

```bash
git clone https://github.com/Thilak1-8/syllabus_finder_frontend.git
cd syllabus_finder_frontend
npm install
```

### Running the App

```bash
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

### Backend

See the [syllabus_finder_backend](https://github.com/Thilak1-8/syllabus_finder_backend) for backend setup.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, feature requests, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Maintainer

Developed and maintained by [Thilak1-8](https://github.com/Thilak1-8).
