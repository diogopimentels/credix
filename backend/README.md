# CrediMestre Backend

Backend for the CrediMestre Loan Management System.

## Technologies

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database

## Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update `DATABASE_URL` with your PostgreSQL connection string.
    - Update `JWT_SECRET` with a secure key.

4.  Run Database Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  Start the Server:
    ```bash
    npm run dev
    ```

## API Routes

### Users
- `POST /users`: Register a new user.
- `POST /users/sessions`: Authenticate (Login).

### Clients
- `POST /clients`: Create a client.
- `GET /clients`: List all clients.
- `GET /clients/:id`: Get client details.
- `PUT /clients/:id`: Update client.
- `DELETE /clients/:id`: Delete client.

### Loans
- `POST /loans`: Create a loan (Auto-calculates interest).
- `GET /loans`: List all loans (Optional query: `?clientId=...`).
- `GET /loans/:id`: Get loan details.
- `PATCH /loans/:id/status`: Update loan status.

### Payments
- `POST /payments`: Register a payment (Auto-updates loan status).

### Dashboard
- `GET /dashboard`: Get aggregated statistics.

## Testing

Import the `requests.json` file into Postman or Insomnia to test the endpoints.
