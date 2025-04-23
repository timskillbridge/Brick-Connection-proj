# 🧱 Brick-Connect

Catalog and organize your Lego sets, official or custom, with a clean, modern app built with Django + React.

---

## 📚 Description

**Brick-Connect** is a full-stack web app that lets users track, customize, and manage their Lego set collection. Users can register using just an email and password. Collections can include official Lego sets (fetched and linked) or custom sets with uploaded images. A clean UI, image background removal, and set grouping features make this more than a simple inventory.

---

## 🛠️ Tech Stack

**Frontend**  
- React 19  
- Vite  
- React Router  
- TailwindCSS  
- Bootstrap 5  
- Axios

**Backend**  
- Django  
- Django REST Framework  
- Token Authentication  
- CORS support  
- Pillow (for image handling)

---

## 🔐 Features

- ✅ Email-based user registration and authentication (username auto-generated from email)
- 🔐 Token-based auth to protect account data
- 📦 Create and manage a personal Lego collection
- 🧱 Add official sets with name, number, image, and reference URL
- 🧰 Add custom sets with piece count, name, image upload
- 🪄 Custom set image background removal for consistent display
- 📂 Group sets into named collections
- 🔧 RESTful API for users, collections, sets, and set groups

---

## 📂 Project Structure

```
/back-end/         # Django project
    ├── Assets
    ├── Brick_Connection
    ├── collection_app/
    ├── Media
    ├   └── images
    └── user_app/
/front-end/        # React app (Vite)
/src/
    ├── game_assets
    ├── images/
    ├── components/
    ├── pages/
    ├── Utility
    ├── App.jsx
```

---

## 🚀 Getting Started

### ⚙️ Backend Setup (Django)

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```
2. Create Environmental variable file (.env) and place your Brickable API credentials
    ```
   Example: VITE_BRICKABLE=**API KEY HERE**
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### 💻 Frontend Setup (React)

1. Navigate to the `front-end` folder:
   ```bash
   cd front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environmental variable (.env) and configure your create superuser endpoint and NOUN Project credentials
   ```
   SUPER_ENDPOINT = 'path to superuser endpoint'
   NOUN_K = 'NOUN Project Key'
   NOUN_S = 'Noun Project Secret'
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🌐 CORS Configuration

Make sure the Django backend allows your frontend to connect:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

## 🔑 API Overview

### 🔐 Authentication & User Management

| api/v1/user/ Endpoint                    | Method | Description                             |
|------------------------------------------|--------|-----------------------------------------|
| `/register/`                             | POST   | Register a new user                     |
| `/login/`                                | POST   | Log in and retrieve token               |
| `/logout/`                               | POST   | Log out and invalidate token            |
| `/`                                      | GET    | Get info on the currently logged-in user|
| `/a-user/<user_id>/`                     | GET    | Get data on a specific user             |
| `/manage-users/`                         | GET    | View all registered users (admin)       |
| `/delete/<user_id>/`                     | DELETE | Delete a user account                   |
| `/<SUPER_ENDPOINT>/`                     | POST   | Register a new superuser                |

### 📦 Collection & Set Management

| api/v1/collection/ Endpoints                         | Method             | Description                                     |
|------------------------------------------------------|--------------------|-------------------------------------------------|
| `/`                                                  | GET                | View the entire user's collection               |
| `/set_groups/`                                       | GET, POST          |        | List or create a set group             |
| `/set_groups/<set_group_id>/`                        | GET, PUT, DELETE   | View, update, delete a set group                |
| `/set_groups/<set_group_id>/single_sets/`            | GET, POST List set |                                                 |
| `/set_groups/<set_group_id>/single_sets/<set_id>/`   | GET, PUT, DELETE   | View, update, or delete a single set            |
| `/custom_sets/`                                      | POST               | Create a custom set                             |
| `/official-sets/`                                    | POST               | Add an official Lego set                        |
| `/all_sets/`                                         | GET                | View all sets (official + custom) for the user  |

### 🖼️ Media & Image Tools

| api/v1/collection Endpoints | Method | Description                              |
|-----------------------------|--------|------------------------------------------|
| `/process_image/`           | POST   | Upload an image and remove its background|
| `/delete_temp_image/`       | POST   | Delete a temporary processed image       |


---

## 🌍 Deployment

This app can be deployed with:

- **Frontend**: Vercel, Netlify, or Surge
- **Backend**: Render, Railway, or Heroku

Make sure to update `CORS_ALLOWED_ORIGINS` with your deployed frontend URL.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork this repo

---

## 📄 License

MIT License


