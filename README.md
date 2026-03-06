# Pharmacy Inventory & Distributor Management System

A full-stack **Pharmacy / Medical Store Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.
The system helps pharmacy owners efficiently manage **users, distributors, medicine stock, purchases, and sales invoices** with a modern responsive dashboard.

The application includes **secure authentication with Gmail OTP verification, password reset functionality, and user-specific data management**.

---

# Project Features

## User Authentication & Security

* User registration with **Gmail OTP verification**
* Secure login system
* **Forgot password via email verification**
* Password reset functionality
* Password encryption using **bcrypt**
* **JWT authentication** for protected APIs
* **User-wise data storage** ensuring each user only accesses their own pharmacy data

---

## Distributor Management

* Add new distributors
* Edit distributor information
* Delete distributors
* Store distributor details including:

  * GSTIN
  * District
  * Name
  * Mobile Number
  * Licence Number
* View distributor **purchase invoice history**

---

## Medicine & Stock Management

* Add medicines to stock
* Track available medicine quantity
* Automatic stock updates when medicines are purchased or sold
* Maintain medicine records for pharmacy inventory

---

## Purchase Management

* Record medicine purchases from distributors
* Store purchase invoice details
* Update stock automatically after purchase
* Maintain **purchase history for distributors**

---

## Sales & Billing System

* Generate customer bills
* Record medicine sales
* Maintain complete **sales history**

---

## Distributor Invoice History

* View distributor invoice history
* See purchased medicines
* Track quantity and pricing details
* Maintain transaction records for auditing

---

## Responsive Dashboard UI

* Built with **React.js and Tailwind CSS**
* Mobile-friendly interface
* Responsive layout for:

  * Desktop
  * Tablet
  * Mobile devices

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* RESTful API Architecture

## Database

* MongoDB
* Mongoose ODM

## Authentication

* JWT (JSON Web Tokens)
* bcrypt password hashing
* Gmail SMTP email verification

## Development Tools

* Git & GitHub
* Postman
* VS Code
* Chrome DevTools

---

# Project Architecture

The project follows a **MERN full-stack architecture**:

Frontend (React) → API Requests → Backend (Node.js + Express) → MongoDB Database

Each authenticated user has **separate pharmacy data stored in the database**.

---

# Project Structure

```
project-root
│
├── frontend
│   ├── components
│   ├── pages
│   ├── context
│   ├── assets
│   └── App.jsx
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   ├── config
│   └── server.js
│
└── README.md
```

---

# Installation Guide

## 1 Clone the Repository

```
git clone https://github.com/your-username/pharmacy-management-system.git
```

---

## 2 Install Backend Dependencies

```
cd backend
npm install
```

---

## 3 Install Frontend Dependencies

```
cd frontend
npm install
```

---

# Environment Variables

Create a **.env** file in the backend folder and add the following variables:

```
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

# Run the Project

Start Backend Server

```
npm run server
```

Start Frontend

```
npm run dev
```

Application will run on

```
http://localhost:5173
```

---

# Future Improvements

* Automatic stock deduction after sale
* Role based authentication (Admin / Staff)
* PDF invoice generation
* Medicine expiry tracking
* Sales analytics dashboard
* Barcode scanning support
* Automated low stock alerts

---

# Author

Deepak Kushwaha

GitHub
https://github.com/Deepak20122004

LinkedIn
https://linkedin.com/in/deepakkushwaha-3a9a08395

Portfolio
https://deepak00-portfolio.netlify.app

---

# License

This project is licensed under the **MIT License**.
