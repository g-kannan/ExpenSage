import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';

const months = [
  ['JAN', 'FEB', 'MAR'],
  ['APR', 'MAY', 'JUN'],
  ['JUL', 'AUG', 'SEP'],
  ['OCT', 'NOV', 'DEC']
];

function CalendarView({ expenses }) {
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    const calculateTotals = () => {
      if (!Array.isArray(expenses) || expenses.length === 0) {
        setMonthlyTotals({});
        return;
      }

      const totals = expenses.reduce((acc, expense) => {
        const { month, amount, currency } = expense;
        if (!acc[month]) {
          acc[month] = {};
        }
        if (!acc[month][currency]) {
          acc[month][currency] = 0;
        }
        acc[month][currency] += parseFloat(amount) || 0;
        return acc;
      }, {});

      setMonthlyTotals(totals);
    };

    calculateTotals();
  }, [expenses]);

  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${Number(amount).toFixed(2)}`;
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 2 }}>
      {months.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {row.map((month) => (
            <Paper
              key={month}
              sx={{
                p: 2,
                height: '180px',
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>{month}</Typography>
              
              {monthlyTotals[month] ? (
                Object.entries(monthlyTotals[month]).map(([currency, total], idx) => (
                  <Typography key={idx} variant="body2" sx={{ color: 'text.primary', mt: 1 }}>
                    {formatAmount(total, currency)}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  No expenses
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default CalendarView;
