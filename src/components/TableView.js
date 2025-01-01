import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
  TableSortLabel
} from '@mui/material';

function TableView({ expenses, onReset }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('month');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${Number(amount).toFixed(2)}`;
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Expenses Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['month', 'category', 'biller', 'amount', 'currency'].map((headCell) => (
                <TableCell key={headCell} sortDirection={orderBy === headCell ? order : false}>
                  <TableSortLabel
                    active={orderBy === headCell}
                    direction={orderBy === headCell ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell)}
                  >
                    {headCell.charAt(0).toUpperCase() + headCell.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedExpenses.map((expense, index) => (
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
