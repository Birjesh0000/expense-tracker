# Expense Tracker

A full-stack personal finance application built with MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── package.json
│   ├── server.js        # Express server entry point
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── instruction.md       # Project requirements
```

## Features to Implement

### Phase 1: Backend Core
- [ ] Setup Express + MongoDB connection
- [ ] Create Expense model
- [ ] Implement POST /expenses
- [ ] Implement GET /expenses (with filtering & sorting)
- [ ] Add idempotency logic
- [ ] Add validation and error middleware

### Phase 2: Frontend Basic UI
- [ ] Setup Vite + Tailwind CSS
- [ ] Create expense form component
- [ ] Create expense table component
- [ ] Connect form to POST /expenses
- [ ] Connect table to GET /expenses

### Phase 3: Real-World Handling
- [ ] Prevent multiple form submissions
- [ ] Add loading spinner
- [ ] Add error display
- [ ] Handle page refresh scenarios
- [ ] Test retry scenarios

### Phase 4: Polish
- [ ] Input validation (amount, date)
- [ ] UI spacing and layout
- [ ] Currency formatting
- [ ] Empty state handling

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
NODE_ENV=development
```

Run the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Run the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Requirements

- Node.js (v16 or higher)
- MongoDB (local or connection string)
- npm or yarn

## Data Model

**Expense**
- `id`: Unique identifier (MongoDB ObjectId)
- `amount`: Number (currency in cents)
- `category`: String
- `description`: String
- `date`: Date
- `createdAt`: Timestamp (for idempotency)
- `idempotencyKey`: String (for preventing duplicate submissions)

## API Endpoints

### POST /api/expenses
Create a new expense with idempotency support.

**Request:**
```json
{
  "amount": 1500,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-02-18",
  "idempotencyKey": "unique-key"
}
```

**Response:**
```json
{
  "id": "...",
  "amount": 1500,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-02-18",
  "createdAt": "2024-02-18T10:30:00Z"
}
```

### GET /api/expenses
Get all expenses with optional filtering and sorting.

**Query Parameters:**
- `category`: Filter by category
- `sort`: Sort by date_desc (newest first)

**Response:**
```json
{
  "expenses": [...],
  "total": 5000
}
```

## Notes

- This project uses a monorepo structure with separate backend and frontend folders
- Tailwind CSS for utility-first styling
- Redux Toolkit for state management (to be implemented)
- Vite for fast development and optimized builds
