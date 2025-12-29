# ShopSphere

A fully functional e-commerce shopping system with React, Express, and MySQL.

## Prerequisites

1.  **Node.js**: Installed.
2.  **MySQL Server**: Running.

## Setup Instructions

### 1. Database Setup
The system requires a MySQL database.
1.  Open MySQL Workbench or your command line.
2.  Create a database named `shopsphere_db`.
    ```sql
    CREATE DATABASE shopsphere_db;
    ```
3.  Open `server/.env` and update your MySQL credentials:
    ```
    DB_USER=root
    DB_PASSWORD=your_password_here
    ```

### 2. Run the Project
We have provided a convenient script to start everything.
1.  Double-click `run_project.bat` in the root folder.
2.  This will start:
    -   Backend Server on port 5000.
    -   Frontend Client on http://localhost:5173.

## Features
-   **Customers**: Browse products, Add to Cart, Checkout (Dummy Payment), View Order History.
-   **Admin**: Dashboard, Sales Analytics, Top Products, Add/Edit Products.
-   **Security**: JWT Authentication, Password Hashing, Role-Based Access Control.

## Default Credentials
Register a new account.
-   First user registered can be manually updated to 'admin' in database for testing admin features, OR modify the registration logic temporarily.
-   *Tip*: To easily make an admin, register a user, then run this SQL:
    ```sql
    UPDATE Users SET role='admin' WHERE email='your_email@example.com';
    ```
