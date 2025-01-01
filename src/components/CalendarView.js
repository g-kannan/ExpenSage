import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import * as duckdb from '@duckdb/duckdb-wasm';
import * as arrow from 'apache-arrow';

const months = [
  ['JAN', 'FEB', 'MAR'],
  ['APR', 'MAY', 'JUN'],
  ['JUL', 'AUG', 'SEP'],
  ['OCT', 'NOV', 'DEC']
];

function CalendarView({ expenses }) {
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [db, setDb] = useState(null);

  // Initialize DuckDB
  useEffect(() => {
    const initDB = async () => {
      try {
        // Instantiate the database
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
        const worker = new Worker(bundle.mainWorker);
        const logger = new duckdb.ConsoleLogger();
        const database = new duckdb.AsyncDuckDB(logger, worker);
        await database.instantiate(bundle.mainModule, bundle.pthreadWorker);
        setDb(database);
      } catch (err) {
        console.error('Failed to initialize DuckDB:', err);
      }
    };

    initDB();
    
    return () => {
      if (db) {
        db.terminate();
      }
    };
  }, []);

  // Calculate totals using DuckDB
  useEffect(() => {
    const calculateTotals = async () => {
      if (!db || expenses.length === 0) {
        setMonthlyTotals({});
        return;
      }

      try {
        const conn = await db.connect();

        // Create a table for expenses
        await conn.query(`
          CREATE OR REPLACE TABLE expenses (
            month VARCHAR,
            amount DOUBLE,
            currency VARCHAR
          )
        `);

        // Insert data
        const values = expenses.map(e => 
          `('${e.month}', ${e.amount}, '${e.currency}')`
        ).join(',');

        await conn.query(`
          INSERT INTO expenses VALUES ${values}
        `);

        // Calculate totals
        const result = await conn.query(`
          SELECT 
            month,
            currency,
            SUM(amount) as total
          FROM expenses
          GROUP BY month, currency
          ORDER BY month, currency
        `);

        // Process results
        const totals = {};
        result.toArray().forEach(row => {
          const month = row.month;
          if (!totals[month]) {
            totals[month] = [];
          }
          totals[month].push({
            currency: row.currency,
            total: row.total
          });
        });

        setMonthlyTotals(totals);
        await conn.close();
      } catch (err) {
        console.error('Error calculating totals:', err);
      }
    };

    calculateTotals();
  }, [db, expenses]);

  const getMonthExpenses = (month) => {
    return expenses.filter(expense => expense.month === month);
  };

  const formatAmount = (amount, currency) => {
    const currencySymbol = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    }[currency] || currency;
    
    return `${currencySymbol}${amount.toFixed(2)}`;
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
              
              {monthlyTotals[month] && monthlyTotals[month].length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    Monthly Total:
                  </Typography>
                  {monthlyTotals[month].map(({ currency, total }, idx) => (
                    <Typography key={idx} variant="body2" color="primary">
                      {formatAmount(total, currency)}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              {getMonthExpenses(month).map((expense) => (
                <Typography key={expense.id} variant="body2" color="text.secondary">
                  {expense.biller}: {formatAmount(expense.amount, expense.currency)}
                </Typography>
              ))}
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default CalendarView;
