import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

const months = [
  ['JAN', 'FEB', 'MAR'],
  ['APR', 'MAY', 'JUN'],
  ['JUL', 'AUG', 'SEP'],
  ['OCT', 'NOV', 'DEC']
];

function CalendarView({ expenses }) {
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [maxSpend, setMaxSpend] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      if (!Array.isArray(expenses) || expenses.length === 0) {
        setMonthlyTotals({});
        setMaxSpend(0);
        return;
      }

      const totals = {};
      let highestSpend = 0;

      expenses.forEach(({ month, amount, currency }) => {
        if (!totals[month]) {
          totals[month] = {};
        }
        if (!totals[month][currency]) {
          totals[month][currency] = 0;
        }
        totals[month][currency] += parseFloat(amount) || 0;

        // Track highest spend for any currency
        const currentTotal = totals[month][currency];
        if (currentTotal > highestSpend) {
          highestSpend = currentTotal;
        }
      });

      setMonthlyTotals(totals);
      setMaxSpend(highestSpend);
    };

    calculateTotals();
  }, [expenses]);

  const formatNumber = (number) => {
    return number.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${formatNumber(amount)}`;
  };

  const getBackgroundColor = (total) => {
    if (!total || maxSpend === 0) return 'transparent';
    const intensity = (total / maxSpend) * 0.5; // Max 50% intensity
    return `rgba(255, 99, 71, ${intensity})`; // Tomato red with variable opacity
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
      {months.flat().map((month) => {
        const monthTotals = monthlyTotals[month] || {};
        const totalAmount = Object.values(monthTotals).reduce((sum, curr) => sum + curr, 0);
        
        return (
          <Paper
            key={month}
            sx={{
              p: 2,
              height: '108px',
              overflow: 'auto',
              backgroundColor: getBackgroundColor(totalAmount),
              transition: 'background-color 0.3s ease'
            }}
          >
            <Typography variant="h6" gutterBottom>{month}</Typography>
            
            {Object.entries(monthTotals).map(([currency, total], idx) => (
              <Typography key={idx} variant="body2" sx={{ color: 'text.primary', mt: 1 }}>
                {formatAmount(total, currency)}
              </Typography>
            ))}
            
            {Object.keys(monthTotals).length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                No expenses
              </Typography>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}

export default CalendarView;
