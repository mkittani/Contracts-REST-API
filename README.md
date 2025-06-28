# Contracts REST API

A robust RESTful API built with **TypeScript**, **Fastify**, and **TypeORM** for managing contracts between clients and contractors. This API simulates a contract management platform where clients can create contracts with contractors, who complete jobs and get paid.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **User Management**: Support for both Client and Contractor user types
- **Contract Management**: Create and manage contracts with different statuses
- **Job Management**: Create jobs, track payments, and manage job status
- **Payment System**: Secure payment processing with balance management
- **Analytics**: Best profession and client analytics with date range filtering
- **Database**: PostgreSQL with TypeORM for robust data management
- **Type Safety**: Full TypeScript implementation with type definitions

## 🏗️ Architecture

The project follows a clean architecture pattern with the following structure:

```
src/
├── app.ts                 # Main application entry point
├── dbConnection.ts        # Database configuration
├── controllers/          # Request handlers
├── services/            # Business logic layer
├── models/              # Data models and entities
├── routes/              # API route definitions
└── utils/               # Utility functions (auth, etc.)
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify (high-performance web framework)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Development**: ts-node-dev for hot reloading

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mkittani/Contracts-REST-API.git
   cd Contracts-REST-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=contracts_db
   TYPEORM_SYNCHRONIZE=true
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `contracts_db`
   - The application will automatically create tables on startup

5. **Start the application**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### 🔐 Authentication Endpoints

#### Register User
```http
POST /profiles/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "profession": "Software Developer",
  "balance": 1000,
  "type": "Client",
  "username": "johndoe",
  "password": "password123"
}
```

#### Login User
```http
POST /profiles/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile
```http
GET /profiles/profile
Authorization: Bearer <token>
```

### 📄 Contract Endpoints

#### Create Contract
```http
POST /contracts/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
  "contractorId": 2,
  "terms": "Develop a web application"
}
```

#### Get Contract by ID
```http
GET /contracts/contracts/:id
Authorization: Bearer <token>
```

#### Get Contracts by Status
```http
GET /contracts/contracts?status=new
Authorization: Bearer <token>
```

**Status Options:** `new`, `in_progress`, `terminated`

### 💼 Job Endpoints

#### Create Job
```http
POST /jobs/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Create user authentication system",
  "price": 500,
  "contractId": 1
}
```

#### Get All Jobs
```http
GET /jobs/jobs
Authorization: Bearer <token>
```

#### Get Unpaid Jobs
```http
GET /jobs/jobs/unpaid
Authorization: Bearer <token>
```

#### Pay for Job
```http
POST /jobs/jobs/:id/pay
Authorization: Bearer <token>
```

#### Get Best Profession (Analytics)
```http
GET /jobs/jobs/best-profession?start=2024-01-01&end=2024-12-31
Authorization: Bearer <token>
```

#### Get Best Clients (Analytics)
```http
GET /jobs/jobs/best-clients?start=2024-01-01&end=2024-12-31&limit=5
Authorization: Bearer <token>
```

### 💰 Balance Endpoints

#### Deposit Balance
```http
POST /balance/balances/deposit/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

**Note:** Deposits cannot exceed 25% of the total unpaid jobs at the time of deposit.

## 🗄️ Data Models

### Profile
- `id`: Primary key
- `firstName`: User's first name
- `lastName`: User's last name
- `profession`: User's profession
- `balance`: Current account balance
- `type`: "Client" or "Contractor"
- `username`: Unique username
- `password`: Hashed password

### Contract
- `id`: Primary key
- `terms`: Contract terms and conditions
- `status`: "new", "in_progress", or "terminated"
- `client`: Reference to client profile
- `contractor`: Reference to contractor profile

### Job
- `id`: Primary key
- `description`: Job description
- `price`: Job price
- `paid`: Payment status
- `paymentDate`: Date when payment was made
- `contract`: Reference to parent contract

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Proper error handling with meaningful messages
- **Authorization**: Route-level authorization checks

## 🧪 Testing

To run tests (when implemented):
```bash
npm test
```

## 📊 Business Rules

1. **User Types**: Users can be either Clients or Contractors
2. **Contract Creation**: Only Clients can create contracts
3. **Job Creation**: Jobs are created within contracts
4. **Payment Processing**: 
   - Clients can only pay for jobs if they have sufficient balance
   - Payment transfers balance from client to contractor
   - Job status updates to paid
5. **Balance Deposits**: Cannot exceed 25% of total unpaid jobs
6. **Contract Status**: Only "in_progress" contracts are considered active

## 🚀 Development

### Available Scripts

- `npm start`: Start the development server with hot reload
- `npm test`: Run tests (when implemented)

### Project Structure

```
src/
├── app.ts                 # Application entry point
├── dbConnection.ts        # Database configuration
├── controllers/          # Request handlers
│   ├── profile.controller.ts
│   ├── contract.controller.ts
│   ├── job.controller.ts
│   └── balance.controller.ts
├── services/            # Business logic
│   ├── profile.service.ts
│   ├── contract.service.ts
│   ├── job.service.ts
│   └── balance.service.ts
├── models/              # Data models
│   ├── profile.model.ts
│   ├── contract.model.ts
│   └── job.model.ts
├── routes/              # API routes
│   ├── profile.route.ts
│   ├── contract.route.ts
│   ├── job.route.ts
│   └── balance.route.ts
└── utils/               # Utilities
    └── auth.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Include error messages, steps to reproduce, and environment details

## 🔮 Future Enhancements

- [ ] Google Sheets integration for transaction logging
- [ ] Swagger/OpenAPI documentation
- [ ] Unit and integration tests
- [ ] CLI client for API interaction
- [ ] Database seeding with dummy data
- [ ] Rate limiting and API throttling
- [ ] Email notifications
- [ ] File upload for contract documents

---

**Built with ❤️ using TypeScript, Fastify, and TypeORM**
