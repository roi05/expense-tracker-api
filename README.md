# Expense Tracker API

A REST API for tracking personal expenses, built with Node.js, Express and MongoDB. Users sign up and log in to receive a JWT, then use it to create, list, view and delete their own expenses.

## Tech stack

- **Express**: HTTP server and routing
- **MongoDB + Mongoose**: data storage and models
- **JSON Web Tokens**: authentication
- **bcrypt**: password hashing
- **Joi**: request validation
- **cors** and **morgan**: CORS handling and request logging

## Getting started

### Prerequisites

- Node.js 16 or newer
- A MongoDB database (local or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/roi05/expense-tracker-api.git
cd expense-tracker-api
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
PORT=4000
SECRET_KEY=replace-with-a-long-random-string
```

| Variable     | Description                               |
| ------------ | ----------------------------------------- |
| `MONGO_URI`  | MongoDB connection string                 |
| `PORT`       | Port the server listens on                |
| `SECRET_KEY` | Secret used to sign and verify JWT tokens |

### Run the server

```bash
npm run dev   # development, restarts on file changes (nodemon)
npm start     # production
```

The server connects to MongoDB first and then starts listening on `PORT`.

### CORS

Only requests from `https://expense-tracker-app-aats.onrender.com` are allowed. To call the API from another frontend (for example `http://localhost:3000` during development), update `origin` in `utils/corsOption.js`.

## API reference

Base URL: `/api/v1`

### Authentication

Expense routes require a token in the `Authorization` header:

```
Authorization: Bearer <token>
```

You get a token from the signup or login endpoints.

### User endpoints

#### `POST /api/v1/user/signup`

Creates a new account.

```json
{ "email": "jane@example.com", "password": "secret123" }
```

**201 Created**

```json
{ "email": "jane@example.com", "token": "<jwt>" }
```

Returns `400` if the email or password is missing, or if the email is already registered.

#### `POST /api/v1/user/login`

Logs in an existing user.

```json
{ "email": "jane@example.com", "password": "secret123" }
```

**200 OK**

```json
{ "email": "jane@example.com", "token": "<jwt>" }
```

Returns `400` if the fields are missing, the email is unknown or the password is wrong.

### Expense endpoints (auth required)

An expense has the following fields:

| Field      | Type   | Required | Example      |
| ---------- | ------ | -------- | ------------ |
| `type`     | string | yes      | `"expense"`  |
| `category` | string | yes      | `"Food"`     |
| `amount`   | number | yes      | `12.5`       |

`user_id`, `createdAt` and `updatedAt` are set by the server.

| Method   | Endpoint               | Description                                |
| -------- | ---------------------- | ------------------------------------------ |
| `GET`    | `/api/v1/expense`      | List the logged-in user's expenses, newest first |
| `POST`   | `/api/v1/expense`      | Create an expense                          |
| `GET`    | `/api/v1/expense/:id`  | Get a single expense                       |
| `DELETE` | `/api/v1/expense/:id`  | Delete an expense                          |
| `PATCH`  | `/api/v1/expense/:id`  | Update an expense (not implemented yet)    |

#### `POST /api/v1/expense`

```json
{ "type": "expense", "category": "Food", "amount": 12.5 }
```

**201 Created**: returns the created expense document.

Returns `400` with Joi validation details if a field is missing or has the wrong type.

#### `GET /api/v1/expense`

**200 OK**

```json
{
  "expense": [
    {
      "_id": "64...",
      "type": "expense",
      "category": "Food",
      "amount": 12.5,
      "user_id": "64...",
      "createdAt": "2023-04-10T12:00:00.000Z",
      "updatedAt": "2023-04-10T12:00:00.000Z"
    }
  ]
}
```

#### `GET /api/v1/expense/:id` and `DELETE /api/v1/expense/:id`

**200 OK**: `{ "expense": { ... } }`

Returns `400` with `{ "error": "No such expense" }` if the ID is invalid or not found.

### Errors

Errors come back as JSON with an `error` field:

```json
{ "error": "Missing token" }
```

| Status | Meaning                                               |
| ------ | ----------------------------------------------------- |
| `400`  | Bad request, validation failure or resource not found |
| `401`  | Missing or invalid token                              |

### Example with curl

```bash
# Sign up and save the token
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}' | jq -r .token)

# Create an expense
curl -X POST http://localhost:4000/api/v1/expense \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","category":"Food","amount":12.5}'

# List expenses
curl http://localhost:4000/api/v1/expense -H "Authorization: Bearer $TOKEN"
```

## Project structure

```
.
├── index.js              # App entry: middleware, routes, DB connection
├── controllers/
│   ├── expenseController.js
│   └── userController.js
├── middleware/
│   └── auth.js           # JWT verification
├── models/
│   ├── expenseModel.js
│   └── userModel.js
├── routes/
│   ├── expense.js
│   └── user.js
└── utils/
    ├── corsOption.js
    ├── createToken.js
    └── expenseValidation.js
```

## Roadmap

- Implement `PATCH /api/v1/expense/:id`
- Limit single-expense get and delete to the expense's owner
- Add token expiry
- Add tests

## License

ISC
