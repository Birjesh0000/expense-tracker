/**
 * Multiple Submit Prevention Strategy
 * 
 * This document explains how the application prevents multiple form submissions
 * and handles real-world scenarios like network retries and page refreshes.
 */

// ============================================================================
// 1. FORM-LEVEL PROTECTION (ExpenseForm.jsx)
// ============================================================================

/**
 * - `isSubmitting`: Local state to track if form is currently submitting
 * - Combined disabled state: `isDisabled = isLoading || isSubmitting`
 * - All form fields disabled during submission
 * - Button shows loading state with spinner
 * - Prevents rapid clicks by checking isSubmitting in handleSubmit
 * 
 * Visual feedback:
 * - Button changes to "Adding..." with loading spinner
 * - Button becomes gray and disabled
 * - Form fields become disabled with muted background
 * - Submission attempt counter shows for debugging
 */

// ============================================================================
// 2. HOOK-LEVEL PROTECTION (useFormSubmit.js)
// ============================================================================

/**
 * - `debounceMs`: Prevents submissions within debounce window (default 300ms)
 * - `lastSubmitTimeRef`: Tracks timestamp of last submission
 * - `submissionAbortControllerRef`: Cancels in-flight requests if new submission initiated
 * - `isSubmitting` state: Single source of truth for submission state
 * - Error and success state management
 * 
 * Features:
 * - Debounced submissions (300ms minimum between attempts)
 * - Request abortion on rapid successive submissions
 * - Abort signal propagation to fetch API
 * - Automatic error/success state tracking
 */

// ============================================================================
// 3. API-LEVEL PROTECTION (expenseApi.js)
// ============================================================================

/**
 * - `AbortSignal` support: Allows cancellation of in-flight requests
 * - `Idempotency-Key`: Unique UUID per submission (backend deduplication)
 * - Error handling for AbortError separate from network errors
 * 
 * When form is resubmitted:
 * 1. Old request aborted if still in-flight
 * 2. New request sent with new UUID
 * 3. Backend returns 200 with existing expense if UUID already exists
 * 4. Prevents duplicate database entries
 */

// ============================================================================
// 4. BACKEND PROTECTION (expense.controller.js)
// ============================================================================

/**
 * - `idempotencyKey`: Checked before creating expense
 * - Unique constraint on idempotencyKey field in MongoDB
 * - Returns 200 OK with existing expense if duplicate idempotencyKey
 * - Prevents database duplicates regardless of frontend bugs
 * 
 * Protection layers:
 * 1. Validation check in controller
 * 2. Unique constraint in database
 * 3. Application-level deduplication logic
 */

// ============================================================================
// 5. REAL-WORLD SCENARIOS HANDLED
// ============================================================================

/**
 * Scenario 1: User clicks submit button twice quickly
 * - Form-level: Form fields disabled, second click ignored
 * - Hook-level: Debounce prevents second submission within 300ms
 * - Result: Only one request sent
 * 
 * Scenario 2: Network timeout, user clicks retry
 * - Old request: Aborted by hook
 * - New request: Sent with same Idempotency-Key
 * - Backend: Returns existing expense (200 OK)
 * - Result: No duplicate created
 * 
 * Scenario 3: Page refresh after submit
 * - Form state: Reset to empty (React component state)
 * - Existing expenses: Fetched from backend on page load
 * - Backend: Has the expense from previous submission
 * - Result: User sees expense in list (data persisted)
 * 
 * Scenario 4: Slow network causing loading state
 * - Form: All fields and button disabled
 * - User cannot interact with form
 * - Button shows spinner and "Adding..."
 * - Result: Clear feedback that submission is in progress
 * 
 * Scenario 5: Network error after partial send
 * - Idempotency-Key: Remains same on retry
 * - Backend: Checks if expense already exists
 * - Result: Idempotent behavior prevents duplicates
 */

// ============================================================================
// 6. IMPLEMENTATION CHECKLIST
// ============================================================================

/**
 * ✓ Form-level disabled state
 * ✓ Hook-level debounce
 * ✓ Request abortion
 * ✓ Idempotency-Key header
 * ✓ Backend deduplication
 * ✓ Unique constraint in database
 * ✓ Error handling
 * ✓ Loading state UI feedback
 * ✓ Submission attempt tracking
 * ✓ Field disabling during submission
 */
