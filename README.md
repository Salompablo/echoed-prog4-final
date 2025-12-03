# 🎵 Echoed - Music Streaming Platform (Frontend)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Echoed** is the frontend client for a modern music streaming and review platform, designed to interact with our custom **Spring Boot REST API**. Built with **Angular** (Standalone Architecture), it provides a rich and interactive user experience for discovering music, engaging with the community, and managing user profiles.

> This project serves as the User Interface for the backend API located here: [Echoed Backend Repository](https://github.com/frannquir/utnmusicapp)

---

## ✨ Key Features

### 🎧 Discovery & Music
* **Content Exploration:** Interactive carousels for Albums, Artists, and Songs.
* **Advanced Search:** Global search bar to quickly find content.
* **In-Depth Details:** Detailed views for Artists (`artist-details`), Albums (`album-details`), and Songs (`song-details`).
* **Rating System:** Star rating system (`star-rating`) for albums and songs.

### 👤 User Management & Profile
* **Robust Authentication:** Login, Registration, and Password Recovery (`forgot-password`, `change-password`).
* **OAuth2:** Integration with external providers (Google) via `oauth2-callback`.
* **Customizable Profile:** Profile editing and avatar selection with a pre-defined collection (Classic Dog, Techno Dog, Metal Wolf, etc.) using `avatar-picker-modal`.
* **Security:** Handling of expired sessions and email verification.

### 💬 Community & Interaction
* **Reviews & Comments:** Users can leave reviews (`review-card`, `review-modal`) and comment on them.
* **Reactions:** "Like" system and other reactions (`reaction-bar`).
* **Moderation:** Features to report or view content status.

### 🛡️ Administration (Back-office)
* **Admin Dashboard:** Panel for user management.
* **Account Moderation:** Tools to ban/unban users (`banned-account-modal`) and view account statuses.

### 🌍 UX/UI & Accessibility
* **Internationalization (i18n):** Multi-language support (English/Spanish) using `ngx-translate`.
* **Dark/Light Mode:** Integrated theme system (`theme.service`).
* **Reusable Components:** Confirmation modals, Loading spinners, Toast notifications, and Dropdowns.

---

## 🛠️ Tech Stack

* **Framework:** Angular (v16+ Standalone Components)
* **Language:** TypeScript
* **Styling:** CSS3 (Custom CSS Variables) & Bootstrap
* **State Management & API:** RxJS, Signals, HttpClient
* **Internationalization:** @ngx-translate/core
* **Icons:** Material Symbols Rounded
* **Build Tool:** Angular CLI / Vite

---

## 🚀 Installation & Setup

Follow these steps to run the project locally:

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/echoed-frontend.git](https://github.com/your-username/echoed-frontend.git)
    cd echoed-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Ensure you have the Echoed backend running or configure the API URL in `src/app/constants/api-endpoints.ts` or your environment files.

4.  **Run Development Server:**
    ```bash
    ng serve
    ```
    The application will be available at `http://localhost:4200/`.

---

## 📂 Project Structure

The main structure within `src/app` is as follows:

```text
src/app
├── components/          # Reusable components (UI, Modals, Cards)
│   ├── album-carousel/
│   ├── comment-card/
│   ├── header/
│   ├── reaction-bar/
│   └── ...
├── pages/               # Main Views (Routes)
│   ├── home/
│   ├── login/
│   ├── admin-dashboard/
│   ├── song-details/
│   └── ...
├── models/              # Interfaces and Types (User, Music, Auth)
├── services/            # Business logic and API communication
├── guards/              # Route guards (AuthGuard)
├── interceptors/        # HTTP Token and Error handling
└── assets/
    ├── i18n/            # Translation files (en.json, es.json)
    └── images/          # Graphic resources and avatars
```
---

## 🤝 Contribution
Fork the project.

1. Create your feature branch (git checkout -b feature/AmazingFeature).

2. Commit your changes (git commit -m 'Add some AmazingFeature').

3. Push to the branch (git push origin feature/AmazingFeature).

4. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.

---

## 👥 Authors

* **Manuel Palacios Inza** - *Full Stack Development & Documentation* - [@manuelpalaciosinza](https://github.com/manuelpalaciosinza)
* **Francisco Quiroga** - *Full Stack Development & Documentation* - [@frannquir](https://github.com/frannquir)
* **Julieta Ramos** - *Full Stack Development & Documentation* - [@juliietaramos](https://github.com/juliietaramos)
* **Pablo Salom Pita** - *Full Stack Development & Documentation* - [@salompablo](https://github.com/salompablo)

---

Developed with ❤️ by the **Echoed Team** for the **University Technical Degree in Programming (UTN)**.
