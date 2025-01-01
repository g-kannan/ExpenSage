import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

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
  'Gas',
  'Internet',
  'Phone',
  'Other',
  'Custom'
];

const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
];

const frequencies = [
  'Monthly',
  'Quarterly',
  'Fortnightly'
];

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    month: '',
    category: '',
    customCategory: '',
    biller: '',
    amount: '',
    currency: 'INR',
    recurring: false,
    frequency: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecurringChange = (e) => {
    setFormData(prev => ({
      ...prev,
      recurring: e.target.checked,
      frequency: e.target.checked ? 'Monthly' : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.month && (formData.category || formData.customCategory) && formData.amount) {
      const category = formData.category === 'Custom' ? formData.customCategory : formData.category;

      if (formData.recurring) {
        const startMonthIndex = months.indexOf(formData.month);
        const expensesToAdd = [];

        switch (formData.frequency) {
          case 'Monthly':
            for (let i = 0; i < 12; i++) {
              const monthIndex = (startMonthIndex + i) % 12;
              expensesToAdd.push({
                category,
                biller: formData.biller || 'Not Specified',
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                month: months[monthIndex],
                id: Date.now() + i
              });
            }
            break;
          case 'Quarterly':
            for (let i = 0; i < 12; i += 3) {
              const monthIndex = (startMonthIndex + i) % 12;
              expensesToAdd.push({
                category,
                biller: formData.biller || 'Not Specified',
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                month: months[monthIndex],
                id: Date.now() + i
              });
            }
            break;
          case 'Fortnightly':
            for (let i = 0; i < 12; i++) {
              const monthIndex = (startMonthIndex + i) % 12;
              expensesToAdd.push({
                category,
                biller: formData.biller || 'Not Specified',
                amount: parseFloat(formData.amount) / 2,
                currency: formData.currency,
                month: months[monthIndex],
                id: Date.now() + i * 2
              });
              expensesToAdd.push({
                category,
                biller: formData.biller || 'Not Specified',
                amount: parseFloat(formData.amount) / 2,
                currency: formData.currency,
                month: months[monthIndex],
                id: Date.now() + i * 2 + 1
              });
            }
            break;
          default:
            break;
        }

        onAddExpense(expensesToAdd);
      } else {
        onAddExpense({
          ...formData,
          category,
          id: Date.now(),
          amount: parseFloat(formData.amount),
          biller: formData.biller || 'Not Specified'
        });
      }

      setFormData({
        month: '',
        category: '',
        customCategory: '',
        biller: '',
        amount: '',
        currency: 'INR',
        recurring: false,
        frequency: ''
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

      {formData.category === 'Custom' && (
        <TextField
          label="Custom Category"
          name="customCategory"
          value={formData.customCategory}
          onChange={handleChange}
          size="small"
          sx={{ width: 130 }}
        />
      )}

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

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.recurring}
            onChange={handleRecurringChange}
            name="recurring"
          />
        }
        label="Recurring"
      />

      {formData.recurring && (
        <TextField
          select
          label="Frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          size="small"
          sx={{ width: 130 }}
        >
          {frequencies.map(frequency => (
            <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
          ))}
        </TextField>
      )}

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
