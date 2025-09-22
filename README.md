# ShopMart

## Description
A full-stack e-commerce platform built with React and Node.js (Express) where users can browse products, add them to a cart, manage quantities, and apply discounts.

PROJECT URL : https://shopmart-frontend-x63y.onrender.com/

admin email:admin@gmail.com
admin password:admin12345

## Features
* User authentication (Login, Register)
* Product Browse and detailed views
* Shopping cart functionality (add, update, remove items)
* Discount calculation on products
* Responsive design

## Technologies Used

**Frontend:**
* React.js
* React Router DOM
* Tailwind CSS (or your chosen CSS framework)
* Axios for API calls
* React Toastify for notifications
* (Add any other specific libraries you use, e.g., Context API for state management)

**Backend:**
* Node.js
* Express.js
* MongoDB (with Mongoose ORM)
* JWT for authentication
* Bcrypt for password hashing
* Nodemon (for development)
* (Add any other specific libraries you use)

## Setup and Installation

### Prerequisites
* Node.js (LTS version recommended)
* MongoDB Atlas account and cluster (or local MongoDB installation)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ShopMart.git](https://github.com/your-username/ShopMart.git)
    cd ShopMart/shopmart-backend # Adjust path if your backend is directly in shopmart
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `shopmart-backend` directory with the following variables:
    ```
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=a_strong_secret_key_for_jwt
    PORT=5000 # Or your preferred port
    ```
    *Replace placeholders with your actual values.*
4.  **Run the backend server:**
    ```bash
    npm start # or npm run dev if you set it up
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../shopmart-frontend # Adjust path if your frontend is directly in shopmart
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `shopmart-frontend` directory with the following variable:
    ```
    VITE_API_BASE_URL=http://localhost:5000/api # Or your backend URL
    ```
4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```

## Usage
* Access the application in your browser at `http://localhost:5173` (or whatever port your frontend runs on).
* Register a new user or log in.
* Browse products, add to cart, and manage your shopping.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
