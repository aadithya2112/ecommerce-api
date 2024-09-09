# E-Commerce API

## Overview

The E-Commerce API is a RESTful API designed for managing users, products, and orders. It includes endpoints for user registration and authentication, as well as CRUD operations for products and orders.

The public API URL is: [https://ecommerce-api-sable.vercel.app/](https://ecommerce-api-sable.vercel.app/)

## Features

- **User Management**

  - Register new users
  - User login and authentication

- **Product Management**

  - Create, read, update, and delete products

- **Order Management**
  - Create and retrieve orders for authenticated users

## Setup

### Prerequisites

- Node.js
- MongoDB
- `dotenv` for environment variable management

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=3000
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

   The server will be running on `http://localhost:3000` by default.

## API Endpoints

### User Endpoints

- **Register a New User**

  - `POST /register`
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `User registered`

- **User Login**

  - `POST /login`
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt-token" }`

### Product Endpoints

- **Create a Product**

  - `POST /products`
  - Headers: `Authorization: Bearer <jwt-token>`
  - Request body: `{ "name": "string", "price": number }`
  - Response: `Product created`

- **Get All Products**

  - `GET /products`
  - Response: `[{ "name": "string", "price": number, "_id": "product-id" }]`

- **Update a Product**

  - `PUT /products/:id`
  - Headers: `Authorization: Bearer <jwt-token>`
  - Request body: `{ "name": "string", "price": number }`
  - Response: `Product updated`

- **Delete a Product**

  - `DELETE /products/:id`
  - Headers: `Authorization: Bearer <jwt-token>`
  - Response: `Product deleted`

### Order Endpoints

- **Create an Order**

  - `POST /orders`
  - Headers: `Authorization: Bearer <jwt-token>`
  - Request body: `{ "products": ["product-id"] }`
  - Response: `Order created`

- **Get User Orders**

  - `GET /orders`
  - Headers: `Authorization: Bearer <jwt-token>`
  - Response: `[{ "userId": "user-id", "products": ["product-id"], "_id": "order-id" }]`

## Authentication

All endpoints except for `/register` and `/login` require authentication. Use the JWT token received from the `/login` endpoint in the `Authorization` header of requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to adjust the README according to any additional features or specific details of your project.
