# Expense Tracker

A minimal full-stack personal finance tool to record and review expenses. Built with production-like quality focusing on real-world scenarios like unreliable networks, browser refreshes, and retries.

## Features

**Core Requirements (Implemented)**
- Create new expense entries with amount, category, description, and date
- View list of expenses
- Filter expenses by category
- Sort expenses by date (newest first) and creation time (recently added)
- Display total of visible expenses after filtering/sorting
- Handle retries and page refreshes safely
- Real-time validation with error display
- Currency formatting (Indian Rupees - ₹)

**Additional Features**
- Category-wise spending summary with percentages
- Form data persistence across page refreshes
- Automated unit tests (35 tests, all passing)
- Loading spinners and error states
- Idempotent API transactions

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Decimal128 for money precision
- Idempotency pattern for retry-safe operations

**Frontend**
- React 18 with Hooks
- Vite 5 for bundling
- Tailwind CSS 3 for styling
- Jest 30 for automated testing
- AbortController for request cancellation

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas URI)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=5000
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3004`

## Testing

Run frontend tests:
```bash
cd frontend
npm test
```

Test coverage:
- Form validation rules (26 tests)
- Currency formatting (9 tests)
- All tests passing (35/35)

## Design Decisions

### 1. **Decimal128 for Currency**
- MongoDB Decimal128 type ensures precise money calculations
- Avoids floating-point errors with currency amounts
- Trade-off: Requires conversion to number for frontend display

### 2. **Idempotency Pattern**
- UUID-based Idempotency-Key header on POST requests
- Duplicate submissions return same response (HTTP 200)
- Enables safe retries on network failures without creating duplicates
- Trade-off: Requires client-side key generation per request

### 3. **Form Data Persistence**
- localStorage hook saves form data during typing
- Form data survives page refreshes
- Improves UX when network issues interrupt submission
- Trade-off: Only temporary storage, cleared on form submission

### 4. **AbortController for Cancellation**
- Cancels previous API requests when user changes filters
- Prevents race conditions when results arrive out-of-order
- Reduces unnecessary processing for stale requests
- Trade-off: Requires proper signal handling in fetch wrapper

### 5. **Frontend Validation**
- Real-time validation provides immediate user feedback
- Server-side validation ensures data integrity
- Two-layer approach protects against client-side bypasses

## Real-World Handling

**Multiple Submit Prevention**
- Form disabled during submission
- Request debouncing with AbortController
- Idempotent POST ensuring safe retries

**Network Resilience**
- Exponential backoff retry logic (3 retries max)
- Graceful AbortSignal handling
- Error messages with retry attempt count

**Page Refresh Safety**
- Form data persisted to localStorage
- Fetch preserves filter/sort state
- No data loss on accidental refresh

## Trade-offs & Constraints

### What Was Done
- ✅ All 5 core acceptance criteria
- ✅ All nice-to-have features (validation, summary, tests, error states)
- ✅ Production-grade error handling
- ✅ Automated test suite
- ✅ Indian Rupees currency formatting

### What Was Intentionally Not Done
- ❌ **Delete/Edit Features** - Not in requirements; add if needed
- ❌ **Monthly Reset/Archiving** - Out of scope
- ❌ **User Authentication** - Assumes single user
- ❌ **Pagination** - Only handles reasonable dataset sizes
- ❌ **Recurring Expenses** - Manual entry only
- ❌ **Mobile App** - Web-only for now
- ❌ **Data Export/Reports** - Not required

### Why These Trade-offs
- Scope: Focus on core requirements for time-boxed delivery
- Complexity: Authentication and pagination add significant overhead
- Real-world: Focused on handling network issues and user errors first
- Maintainability: Smaller feature set easier to extend later

## Validation Rules

**Amount**
- Required
- Must be greater than 0
- Maximum: 999,999,999.99

**Category**
- Required
- 1-100 characters

**Description**
- Required
- 1-500 characters

**Date**
- Required
- Cannot be in the future

## API Endpoints

### POST /api/expenses
Creates a new expense. Idempotent with Idempotency-Key header.

Request:
```json
{
  "amount": 500.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-02-18"
}
```

Response (201 Created):
```json
{
  "status": "success",
  "message": "Expense created successfully",
  "data": {
    "expense": {
      "_id": "...",
      "amount": {"$numberDecimal": "500"},
      "category": "Food",
      "description": "Lunch at restaurant",
      "date": "2026-02-18T00:00:00.000Z",
      "createdAt": "2026-02-18T10:30:00.000Z"
    }
  }
}
```

### GET /api/expenses
Retrieves expenses with optional filtering and sorting.

Query Parameters:
- `category` - Filter by category (exact match)
- `sort` - `date_desc` (newest first) | `date_asc` (oldest first) | `created_desc` (recently added)

Response (200 OK):
```json
{
  "status": "success",
  "message": "Expenses retrieved successfully",
  "data": {
    "expenses": [...],
    "total": 5000.00,
    "count": 5
  }
}
```

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/Expense.js
│   │   ├── controllers/expense.controller.js
│   │   ├── routes/expense.routes.js
│   │   ├── middleware/error.middleware.js
│   │   ├── utils/validation.utils.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/expenseApi.js
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── TotalBar.jsx
│   │   │   ├── CategorySummary.jsx
│   │   │   ├── ErrorAlert.jsx
│   │   │   ├── SuccessAlert.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ValidationError.jsx
│   │   ├── pages/Home.jsx
│   │   ├── utils/
│   │   │   ├── formValidation.js
│   │   │   ├── currencyUtils.js
│   │   │   └── retryUtils.js
│   │   ├── hooks/usePersistentFormState.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── jest.config.js
│
└── README.md
```

## Error Handling

**Server Errors**
- MongoDB validation errors return 400 with field-level error details
- Duplicate key errors for idempotency conflicts
- Graceful error middleware with structured response format

**Client Errors**
- Real-time validation with inline field errors
- Network error messages with retry counts
- Dismissible error alerts for user acknowledgment

## Future Enhancements

If extending this project:
1. Add DELETE endpoint for wrong entries
2. Add EDIT/UPDATE endpoint for corrections
3. Implement user authentication
4. Add pagination for large datasets
5. Add data export (CSV, PDF)
6. Add recurring expense templates
7. Add monthly budgets and alerts