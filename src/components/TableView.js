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
  Box
} from '@mui/material';

function TableView({ expenses }) {
  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const handleExport = () => {
    // Convert expenses to CSV format
    const headers = ['Month', 'Category', 'Biller', 'Amount', 'Currency'];
    const csvData = expenses.map(expense => [
      expense.month,
      expense.category,
      expense.biller,
      expense.amount,
      expense.currency
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
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

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleExport}
          disabled={expenses.length === 0}
        >
          Export to CSV
        </Button>
      </Box>
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
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
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
