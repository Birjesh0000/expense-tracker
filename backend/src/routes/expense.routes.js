import express from 'express';
import { createExpense, getExpenses } from '../controllers/expense.controller.js';

const router = express.Router();

// POST endpoint to create a new expense
router.post('/', createExpense);

// GET endpoint to retrieve expenses with optional filtering and sorting
router.get('/', getExpenses);

export default router;
