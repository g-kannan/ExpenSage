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
      <Box sx={{ mt: 4, py: 2, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center', gap: 4 }}>
        <a href="https://github.com/g-kannan/ExpenSage" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/kannan-g-212242111/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="http://flaticon.com/" target="_blank" rel="noopener noreferrer">Icon Credits: Flaticon.com</a>
      </Box>
    </Container>
  );
}

export default App;
