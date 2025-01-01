import React, { useState } from 'react';
import { Container, Box, Typography, Divider, img } from '@mui/material';
import ExpenseForm from './components/ExpenseForm';
import CalendarView from './components/CalendarView';
import TableView from './components/TableView';
import logo from './assets/ExpenSage_logo.png';

function App() {
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = (newExpenses) => {
    // Ensure newExpenses is an array
    const expensesArray = Array.isArray(newExpenses) ? newExpenses : [newExpenses];
    setExpenses((prevExpenses) => [...prevExpenses, ...expensesArray]);
  };

  const handleReset = () => {
    setExpenses([]);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <img src={logo} alt="ExpenSage Logo" style={{ height: '160px', width: 'auto' }} />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <ExpenseForm onAddExpense={handleAddExpense} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Calendar View</Typography>
          <CalendarView expenses={expenses} />
        </Box>
        <Box>
          <Typography variant="h5" gutterBottom>Table View</Typography>
          <TableView expenses={expenses} onReset={handleReset} />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
