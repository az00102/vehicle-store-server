# 🚗 Vehicle Rental Management System

**Live API URL:** https://vehiclesystem-ten.vercel.app/

A **RESTful backend API** for a Vehicle Rental Management System built with **Node.js, Express, TypeScript, and PostgreSQL**.
This project focuses on **clean architecture**, **role-based access control**, **secure authentication**, and **real-world business logic**.

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure password hashing using **bcrypt**
* Role-based access control (`admin`, `customer`)
* Protected routes using middleware

### 👤 User Management

* User registration & login
* Admin can view and manage all users
* Customers can update only their own profile
* Prevent deletion of users with **active bookings**

### 🚙 Vehicle Management

* Admin-only vehicle creation, update, and deletion
* Vehicle availability tracking (`available`, `booked`)
* Prevent deletion of vehicles with **active bookings**

### 📅 Booking Management

* Create bookings with **automatic total price calculation**
* Customers can view **only their own bookings**
* Admin can view all bookings
* Customers can cancel active bookings
* Admin can mark bookings as `returned`
* Vehicle availability updates automatically on booking status changes

### ⚙️ Business Logic & Data Integrity

* Transaction-safe operations (booking + vehicle updates)
* Protection against invalid state transitions
* SQL injection prevention using parameterized queries
* Clean separation of **Controller → Service → Database**

---

## 🛠️ Technology Stack

### Backend

* **Node.js**
* **Express.js (v5)**
* **TypeScript**

### Database

* **PostgreSQL**
* **pg (node-postgres)**

### Security & Utilities

* **bcryptjs** – password hashing
* **jsonwebtoken** – authentication tokens
* **dotenv** – environment variable management

### Development Tools

* **tsx** – TypeScript execution & watch mode
* **TypeScript** – static typing and safety

---

## 📁 Project Structure

```
src/
├── config/            # Database & environment config
├── middlewares/       # Auth & role authorization
├── modules/
│   ├── auth/          # Auth logic
│   ├── users/         # User management
│   ├── vehicles/      # Vehicle management
│   └── bookings/      # Booking logic
└── server.ts          # Application entry point
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repository-url>
cd assignment-2
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret_key
```

---

### 4️⃣ Run the project (development)

```bash
npm run dev
```

Runs the server in watch mode using **tsx**.

---

### 5️⃣ Build for production

```bash
npm run build
```

---

## 📡 API Usage Overview

## API Overview

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | Public | Register a new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive a JWT access token |

---

### Vehicles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/vehicles` | Admin | Add a new vehicle (name, type, registration number, daily rent price, availability status) |
| GET | `/api/v1/vehicles` | Public | Retrieve all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Retrieve a specific vehicle by ID |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle details (including daily rent price and availability status) |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete a vehicle **only if** it has no active bookings |

---

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/users` | Admin | Retrieve all users |
| PUT | `/api/v1/users/:userId` | Admin / Owner | **Admin:** Update any user’s details or role. **Customer:** Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin | Delete a user **only if** they have no active bookings |

---

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/bookings` | Customer / Admin | Create a booking (validates availability, calculates total price, sets vehicle status to `booked`) |
| GET | `/api/v1/bookings` | Role-based | **Admin:** View all bookings. **Customer:** View only their own bookings |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | **Customer:** Cancel booking (optionally before start date). **Admin:** Mark as `returned` (sets vehicle to `available`). **System:** Auto-marks as `returned` when `rent_end_date` passes |


> 🔑 Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔒 Security Practices

* Passwords are hashed before storage
* JWT payload kept minimal
* SQL injection protection via prepared statements
* Authorization enforced at controller & database level
* Transaction-based updates for critical operations

---

## 📌 Notes

* Designed for **academic submission & real-world backend practice**
* Follows industry-standard REST principles
* Easily extendable (payments, penalties, notifications, reports)

---

## 👨‍💻 Author

**Nayamul Azim Sarker**

---

