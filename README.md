Campus Resource Booking System
🚀 Project Overview
The Campus Resource Booking System is a full-stack web application that allows students and administrators to manage and book campus resources such as:
Classrooms
Labs
Auditoriums
Library Stations
Event Halls
Canteens
Computers
The system provides a structured workflow for booking, approval, and management of campus facilities.

🏗️ Tech Stack
🔹 Backend
Java 17
Spring Boot
Spring Data JPA
Spring Security
MySQL
Maven
🔹 Frontend
React (Vite)
Axios
CSS
🔹 Database
MySQL 8

📌 Features
👨‍🎓 User Features
Register & Login
View available resources
Select booking date
Choose time slot
Confirm booking
View booking history
Check booking status (Pending / Approved / Rejected)
👨‍💼 Admin Features
View all bookings
Approve booking
Reject booking with reason
Manage resources
Monitor system usage

🗂️ Project Structure
campus/
│
├── backend/
│ ├── controller
│ ├── service
│ ├── repository
│ ├── entity
│ ├── config
│ └── CampusApplication.java
└── frontend/
├── components
├── pages
├── services
└── App.jsx

🗄️ Database Schema
Tables Used:
user
department
resource
time_slot
booking
Key Relationships:
One User → Many Bookings
One Resource → Many Bookings
One TimeSlot → Many Bookings
One Department → Many Resources

🔐 Authentication & Authorization
Spring Security based authentication
Role-based access:
USER
ADMIN

If you want, I can also format this as a professional README.md file ready for GitHub 🚀

in file folder add dto and exceptions in backend

Here is your updated project structure with dto and exceptions added inside the backend folder (no extra empty lines):

🗂️ Project Structure

campus/
│
├── backend/
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── exceptions
│   ├── config
│   └── CampusApplication.java
│
└── frontend/
    ├── components
    ├── pages
    ├── services
    └── App.jsx

🗄️ Database Schema
Tables Used:
user
department
resource
time_slot
booking
Key Relationships:
One User → Many Bookings
One Resource → Many Bookings
One TimeSlot → Many Bookings
One Department → Many Resources

🔐 Authentication & Authorization
Spring Security based authentication
Role-based access:
USER
ADMIN
