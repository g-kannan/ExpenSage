import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';

function TableView({ expenses, onReset }) {
  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${Number(amount).toFixed(2)}`;
  };

  const calculateYearlyTotals = () => {
    return expenses.reduce((acc, { amount, currency }) => {
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += parseFloat(amount) || 0;
      return acc;
    }, {});
  };

  const handleExport = () => {
    const headers = ['Month', 'Category', 'Biller', 'Amount', 'Currency'];
    const csvData = expenses.map(expense => [
      expense.month,
      expense.category,
      expense.biller,
      expense.amount,
      expense.currency
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'expensage_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const yearlyTotals = calculateYearlyTotals();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Yearly Totals Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Yearly Totals
          </Typography>
          {Object.entries(yearlyTotals).map(([currency, total], idx) => (
            <Typography key={idx} variant="body1">
              {formatAmount(total, currency)}
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={onReset}
        >
          Reset Data
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleExport}
          disabled={expenses.length === 0}
        >
          Export to CSV
        </Button>
      </Box>

      {/* Expenses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Biller</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.month}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.biller}</TableCell>
                <TableCell align="right">{formatAmount(expense.amount, expense.currency)}</TableCell>
                <TableCell>{expense.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TableView;
