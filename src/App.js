import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import ExpenseForm from './components/ExpenseForm';
import CalendarView from './components/CalendarView';
import TableView from './components/TableView';

function App() {
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        ExpenSage
      </Typography>
      
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
          <TableView expenses={expenses} />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
