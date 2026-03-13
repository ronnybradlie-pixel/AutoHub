# Automotive Marketplace Platform
**Overview**

> The Automotive Marketplace Platform is a web-based system that allows users to buy, sell, and rent cars through verified dealership companies. Individual users cannot directly list cars; instead, they submit their vehicles through approved dealership companies.
Each dealership must be verified by a super administrator using their business license before they can operate on the platform.Dealership companies manage vehicle listings, approve cars submitted by users, and can also sell or rent their own vehicles through the platform.

# Problem the System Solves

Many online car marketplaces suffer from:

1.Fraudulent car listings

2.Unverified sellers

3.Lack of trust between buyers and sellers

4.Poor vehicle quality control

**This platform solves these problems by:**

1.Requiring verified dealership companies

2.Implementing car approval processes

3.Allowing administrative oversight

4.Ensuring vehicle specification validation

## System Objectives

The project aims to:

Create a trusted car marketplace

Allow users to sell vehicles through verified dealerships

Enable companies to sell and rent vehicles

Provide detailed car specifications

Ensure secure and organized vehicle listings

## System Users
1. Super Administrator

Responsible for platform management.

2. Dealership Company Admin

Each dealership has its own admin.

3. Users (Buyers / Sellers)

Regular users who use the platform.

## Core Features
1. User Authentication

2. Dealership Company Registration

3. Car Listing System

4. Car Approval System

5. Car Buying

6. Car Renting

7. Car Management

Dealership admins can:

Update car details

Remove listings

Change availability

Manage rental cars

**Technology Stack**
Backend:Python,Django,Django REST Framework,PostgreSQL

Frontend:React.js,Tailwind CSS,Axios,React Router

**Backend Structure (Django)**
backend/
│
├── manage.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── asgi.py
│
├── apps/
│   │
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── boooing/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── cars/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── company/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   └── project/
│       ├── settings.py
│       ├── asgi.py
│       ├── wsgi.py
│       └── urls.py
│
└── requirements.txt


frontend/
│
├── public/
│
├── src/
│
│   ├── api/
│   │   ├── authApi.js
│   │   ├── carApi.js
│   │   ├── dealershipApi.js
│   │   └── rentalApi.js
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CarCard.jsx
│   │   ├── Pagination.jsx
│   │   └── SearchBar.jsx
|   │   │__ Mainlayout.jsx
│   │   ├── Dashboard.jsx
│   │   └──
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CarDetails.jsx
│   │   ├── BuyCar.jsx
│   │   ├── RentCar.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DealershipDashboard.jsx
│   │   ├── SubmitCar.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   │
│   ├── assets/
│   │   └── images/
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
