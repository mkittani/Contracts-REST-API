## 💼 Contract REST API

### 📘 Level: Easy  
Build a RESTful API using **TypeScript**, **Fastify**, and **TypeORM**.

This API simulates a contract management platform where **clients** can create contracts with **contractors**, who complete **jobs** and get paid. Includes authentication, payments, analytics, and optional integration with **Google Sheets**.

---

### 🧩 Data Models

#### 🔐 Profile
A user profile can either be a `client` or a `contractor`.

- `firstName`: string  
- `lastName`: string  
- `profession`: string  
- `balance`: number  
- `type`: `"Client"` | `"Contractor"`  
- `username`: string (unique)  
- `password`: string (hashed)  

> A client creates contracts. A contractor fulfills jobs and gets paid. Balance updates accordingly.

---

#### 📄 Contract

A contract represents an agreement between a client and a contractor.

- `terms`: string  
- `status`: `"new"` | `"in_progress"` | `"terminated"`  
- `client`: `Profile`  
- `contractor`: `Profile`  

> Only contracts with status `in_progress` are considered `active`.

---

#### 🧾 Job

Represents a paid or unpaid task in a contract.

- `description`: string  
- `price`: number  
- `paid`: boolean  
- `paymentDate`: Date (nullable)  
- `contract`: Contract  

---

### ✅ Requirements

- Use **Fastify** as HTTP framework
- Use **TypeORM** for data modeling and PostgreSQL for storage
- Implement authentication (Token Auth or JWT or session-based auth)
- Set up login, signup, and profile endpoints
- Generate API docs with **Swagger/OpenAPI** (`fastify-swagger`)
- Write **unit/integration tests** (e.g., `vitest`, `jest`)
- Seed database with dummy data (use CLI or `typeorm-seeding`)
- Optional: Create a CLI async API client (e.g., `ts-node` script)

---

### 📡 APIs To Implement

#### 🧾 Contracts

- **GET** `/contracts/:id` — return contract only if it belongs to the logged-in user  
- **GET** `/contracts?status=` — return contracts for logged-in user, filter by status (default: active)

#### 👤 Profile

- **GET** `/profile` — return current authenticated user profile  
- **POST** `/signup` — register new user  
- **POST** `/login` — log in and receive token  

#### 💼 Jobs

- **GET** `/jobs` — return all jobs for logged-in user  
- **GET** `/jobs/unpaid` — return unpaid jobs for active contracts  
- **POST** `/jobs/:id/pay` — client pays for a job if balance >= job price  
  - deduct balance from client, add to contractor  
- **GET** `/jobs/best-profession?start=<date>&end=<date>`  
  - return the profession that earned the most during this range  
- **GET** `/jobs/best-clients?start=<date>&end=<date>&limit=<int>`  
  - return top-paying clients in range, limit defaults to 2
    ```
    [
      {
          "id": 1,
          "fullName": "Reece Moyer",
          "paid" : 100.3
      },
      {
          "id": 200,
          "fullName": "Debora Martin",
          "paid" : 99
      },
      {
          "id": 22,
          "fullName": "Debora Martin",
          "paid" : 21
      }
    ]
    ```

#### 💰 Balance

- **POST** `/balances/deposit/:userId` — deposit into client's balance  
  - must not exceed 25% of unpaid job total at deposit time


