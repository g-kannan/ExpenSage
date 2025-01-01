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
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        display: 'flex', 
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}
    >
      <TextField
        select
        label="Month *"
        name="month"
        value={formData.month}
        onChange={handleChange}
        required
        size="small"
        sx={{ width: 100 }}
      >
        {months.map(month => (
          <MenuItem key={month} value={month}>{month}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Category *"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        size="small"
        sx={{ width: 130 }}
      >
        {categories.map(category => (
          <MenuItem key={category} value={category}>{category}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Biller"
        name="biller"
        value={formData.biller}
        onChange={handleChange}
        size="small"
        sx={{ width: 150 }}
      />

      <TextField
        select
        label="Currency *"
        name="currency"
        value={formData.currency}
        onChange={handleChange}
        required
        size="small"
        sx={{ width: 100 }}
      >
        {currencies.map(({ code, symbol }) => (
          <MenuItem key={code} value={code}>{symbol} {code}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Amount *"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
        size="small"
        sx={{ width: 120 }}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        size="medium"
      >
        Add
      </Button>
    </Box>
  );
}

export default ExpenseForm;
