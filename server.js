const express = require('express');
const mysql = require('mysql');

const app = express();
//const port = 3000;
const frontendPath = __dirname;
app.use(express.static(frontendPath));

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'bhc1tmgtcymfkujibunp-mysql.services.clever-cloud.com',
  user: 'uiqw8ezlk0lvfqsn',
  password: 'nNjWIT2VwNJB2mz9BmOb',
  database: 'bhc1tmgtcymfkujibunp'
});
// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Parse JSON bodies
app.use(express.json());

// Handle POST request to submit employee data
app.post('/submitEmployeeData', (req, res) => {
  const { employeeName, employeeId, department, dob, gender, designation, salary } = req.body;

  // Insert data into MySQL database
  const sql = 'INSERT INTO emp (name, employee_id, department, dob, gender, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [employeeName, employeeId, department, dob, gender, designation, salary];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting employee data:', err);
      res.status(500).json({ error: 'Something went wrong' });
      return;
    }
    console.log('Employee data inserted:', result);
    res.sendStatus(200);
  });
});

// Handle GET request to fetch employee data
app.get('/getEmployeeData', (req, res) => {
  // Retrieve data from MySQL database
  const sql = 'SELECT * FROM emp';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching employee data:', err);
      res.status(500).json({ error: 'Something went wrong' });
      return;
    }
    console.log('Employee data fetched:', result);
    res.json(result);
  });
});

// Handle DELETE request to delete employee data
app.delete('/deleteEmployeeData/:id', (req, res) => {
  const employeeId = req.params.id;

  // Delete data from MySQL database
  const sql = 'DELETE FROM emp WHERE employee_id = ?';

  db.query(sql, employeeId, (err, result) => {
    if (err) {
      console.error('Error deleting employee data:', err);
      res.status(500).json({ error: 'Something went wrong' });
      return;
    }
    console.log('Employee data deleted:', result);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on https://employee-management-sbez.onrender.com/`);
});






















