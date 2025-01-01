import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const categories = [
  'Utilities',
  'Rent',
  'Insurance',
  'Groceries',
  'Entertainment',
  'Other'
];

const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
];

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    month: '',
    category: '',
    biller: '',
    amount: '',
    currency: 'INR'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.month && formData.category && formData.amount) {
      onAddExpense({
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount),
        biller: formData.biller || 'Not Specified'
      });
      setFormData({
        month: '',
        category: '',
        biller: '',
        amount: '',
        currency: 'INR'
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        select
        name="month"
        label="Month"
        value={formData.month}
        onChange={handleChange}
        required
        sx={{ minWidth: 120 }}
      >
        {months.map(month => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        required
        sx={{ minWidth: 150 }}
      >
        {categories.map(category => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="biller"
        label="Biller (Optional)"
        value={formData.biller}
        onChange={handleChange}
      />

      <TextField
        select
        name="currency"
        label="Currency"
        value={formData.currency}
        onChange={handleChange}
        required
        sx={{ minWidth: 100 }}
      >
        {currencies.map(currency => (
          <MenuItem key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="amount"
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: currencies.find(c => c.code === formData.currency)?.symbol
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ minWidth: 100 }}
      >
        Add
      </Button>
    </Box>
  );
}

export default ExpenseForm;
