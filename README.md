# Dayflow - Human Resource Management System

> **Every workday, perfectly aligned.**

## 📌 Overview

**Dayflow** is a Human Resource Management System (HRMS) designed to digitize and streamline essential HR operations.

The system provides separate access for **Employees** and **Admin/HR Officers** and helps manage employee profiles, attendance, leave requests, payroll information, approval workflows, notifications, and reports.

## ✨ Features

### 🔐 Authentication & Authorization

* Secure Sign Up and Sign In
* JWT Authentication
* Role-based access control
* Employee and Admin/HR roles
* Protected routes

### 👤 Employee Features

* View personal and job details
* Edit phone number and address
* Upload profile picture
* Check In and Check Out
* View daily and weekly attendance
* Apply for leave
* Track leave request status
* View payroll and salary details
* Receive notifications

### 👨‍💼 Admin / HR Features

* View and manage all employees
* Add, edit, and manage employee details
* View attendance records of all employees
* Approve or reject leave requests
* Add comments to leave requests
* Manage payroll and salary structure
* View reports and analytics
* Monitor employee activities

## ⏰ Attendance Management

Employees can:

* Check In
* Check Out
* View attendance history

Attendance statuses include:

* Present
* Absent
* Half-day
* Leave

## 🏖️ Leave Management

Employees can apply for:

* Paid Leave
* Sick Leave
* Unpaid Leave

Each leave request includes:

* Leave type
* Start date
* End date
* Remarks
* Status

Leave statuses:

`Pending` → `Approved` / `Rejected`

Admin/HR can review, approve, reject, and comment on leave requests.

## 💰 Payroll Management

### Employee

Employees can view their payroll information, including:

* Basic Salary
* Allowances
* Deductions
* Net Salary

Payroll information is read-only for employees.

### Admin / HR

Admin/HR can:

* View payroll details of all employees
* Add payroll records
* Update salary structure
* Manage allowances and deductions

## 📊 Reports & Analytics

The system provides:

* Attendance reports
* Attendance statistics
* Leave statistics
* Employee activity overview
* Payroll summaries
* Salary slip reports

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS / Tailwind CSS
* Lucide React

### Backend

* Python
* Django
* Django REST Framework
* JWT Authentication

### Database

* MySQL

## 📁 Project Structure

```text
dayflow-hrms/
│
├── frontend/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/               # Django Backend
│   ├── accounts/
│   ├── employees/
│   ├── attendance/
│   ├── leaves/
│   ├── payroll/
│   ├── notifications/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/deepikadp30/dayflow-hrms.git
cd dayflow-hrms
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the MySQL database and update the database settings.

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will run on the local development server.
User Roles

| Feature | Employee               | Admin / HR |

| View Own Profile                  | ✅ | ✅ |
| Edit Limited Profile Details      | ✅ | ✅ |
| Manage All Employees              | ❌ | ✅ |
| Check In / Check Out              | ✅ | ❌ |
| View Own Attendance               | ✅ | ❌ |
| View All Attendance               | ❌ | ✅ |
| Apply for Leave                   | ✅ | ❌ |
| Approve / Reject Leave            | ❌ | ✅ |
| View Payroll                      | Own | All Employees |
| Update Salary Structure           | ❌ | ✅ |
| Reports & Analytics               | ❌ | ✅ |

## 🔮 Future Enhancements

* Email verification
* Email notifications
* Automated attendance reminders
* Downloadable salary slips
* Advanced analytics
* Leave balance tracking
* Document upload and management
* Mobile application
* Biometric attendance integration

## 📄 Problem Statement

The system is designed to digitize and streamline core HR operations, including employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows.



---

⭐ If you like this project, consider giving the repository a star!
