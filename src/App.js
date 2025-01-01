import React, { useState } from 'react';
import { Container, Box, Typography, Divider, useMediaQuery, ButtonGroup, Button, Card, CardContent } from '@mui/material';
import ExpenseForm from './components/ExpenseForm';
import CalendarView from './components/CalendarView';
import TableView from './components/TableView';
import logo from './assets/ExpenSage_logo.png';

function App() {
  const [expenses, setExpenses] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [view, setView] = useState('calendar');

  const handleToggleView = (view) => {
    setView(view);
  };

  const handleAddExpense = (newExpenses) => {
    const expensesArray = Array.isArray(newExpenses) ? newExpenses : [newExpenses];
    setExpenses((prevExpenses) => [...prevExpenses, ...expensesArray]);
  };

  const handleReset = () => {
    setExpenses([]);
  };

  const calculateYearlyTotal = () => {
    return expenses.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
  };

  const calculateAvgExpensePerMonth = () => {
    return calculateYearlyTotal() / 12;
  };

  const calculateAvgExpensePerDay = () => {
    return calculateYearlyTotal() / 365;
  };

  const formatNumber = (number) => {
    return number.toLocaleString('en-IN', { maximumFractionDigits: 0 });
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
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <img src={logo} alt="ExpenSage Logo" style={{ height: '136px', width: 'auto' }} />
      </Box>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <ExpenseForm onAddExpense={handleAddExpense} />
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleReset}
        >
          RESET
        </Button>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', gap: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Yearly Total</Typography>
            <Typography variant="body1">₹{formatNumber(calculateYearlyTotal())}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Avg Expense/Month</Typography>
            <Typography variant="body1">₹{formatNumber(calculateAvgExpensePerMonth())}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Avg Expense/Day</Typography>
            <Typography variant="body1">₹{formatNumber(calculateAvgExpensePerDay())}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleExport}
        >
          Export to CSV
        </Button>
      </Box>
      <ButtonGroup fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>
        <Button onClick={() => handleToggleView('calendar')} variant={view === 'calendar' ? 'contained' : 'outlined'}>Calendar View</Button>
        <Button onClick={() => handleToggleView('table')} variant={view === 'table' ? 'contained' : 'outlined'}>Table View</Button>
      </ButtonGroup>
      <Box>
        {view === 'calendar' && <CalendarView expenses={expenses} />}
        {view === 'table' && <TableView expenses={expenses} onReset={handleReset} />}
      </Box>
      <Box sx={{ mt: 4, py: 2, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center', gap: 4 }}>
        <a href="https://github.com/g-kannan/ExpenSage" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/kannan-g-212242111/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="http://flaticon.com/" target="_blank" rel="noopener noreferrer">Icon Credits: Flaticon.com</a>
      </Box>
    </Container>
  );
}

export default App;
