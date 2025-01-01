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

function RecurringExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    startMonth: '',
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
    if (formData.startMonth && formData.category && formData.amount) {
      const startMonthIndex = months.indexOf(formData.startMonth);
      const expensesToAdd = [];

      // Add one entry for each month starting from the selected month
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        expensesToAdd.push({
          category: formData.category,
          biller: formData.biller || 'Not Specified',
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          month: months[monthIndex],
          id: Date.now() + i
        });
      }

      // Add all generated expenses
      expensesToAdd.forEach(expense => onAddExpense(expense));

      // Reset form
      setFormData({
        startMonth: '',
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
        alignItems: 'center',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        p: 2,
        borderRadius: 1
      }}
    >
      <TextField
        select
        label="Start Month *"
        name="startMonth"
        value={formData.startMonth}
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
        color="secondary"
        type="submit"
        size="medium"
      >
        Add Recurring
      </Button>
    </Box>
  );
}

export default RecurringExpenseForm;
