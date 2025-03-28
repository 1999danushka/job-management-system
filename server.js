const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       // Set your MySQL root password
  database: 'repair' // Replace with your DB name
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
    console.log(req.body);    
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error during query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

//Add Job details
app.post('/add-job', (req, res) => {
    
    const {
      IMS_JOB_NUMBER,
      SERIAL_NUMBER,
      ASSET_NUMBER,
      DATE,
      DESCRIPTION,
      TECHNICIAN_NAME,
      HAND_IN_DATE
    } = req.body;
  
    const query = `
      INSERT INTO jobs 
      (IMS_JOB_NUMBER, SERIAL_NUMBER, ASSET_NUMBER, DATE, DESCRIPTION, TECHNICIAN_NAME, HAND_IN_DATE) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [IMS_JOB_NUMBER, SERIAL_NUMBER, ASSET_NUMBER, DATE, DESCRIPTION, TECHNICIAN_NAME, HAND_IN_DATE],
      (err, result) => {
        if (err) {
          console.error('Error inserting job:', err);
          res.status(500).json({ message: 'Database error' });
        } else {
          res.json({ message: 'Job added successfully!', jobId: result.insertId });
        }
      }
    );
  });



  // Search Repair by IMS_JOB_NUMBER
app.get('/search-repair', (req, res) => {
    const { imsJobNumber } = req.query;

    if (!imsJobNumber) {
        return res.status(400).json({ message: 'IMS Job Number is required!' });
    }

    const query = `
        SELECT * FROM jobs WHERE IMS_JOB_NUMBER = ?
    `;
    
    db.query(query, [imsJobNumber], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No job found with the given IMS Job Number' });
        }

        res.json(results[0]); // Send the first matching result
    });
});

// Update Repair by IMS_JOB_NUMBER
app.put('/update-repair', (req, res) => {
    const { imsJobNumber, description, assetNumber, date } = req.body;
    //--------

    // Ensure all fields are provided
    if (!imsJobNumber || !description || !assetNumber || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Update query
    const query = `
        UPDATE jobs
        SET DESCRIPTION = ?, ASSET_NUMBER = ?, DATE = ?
        WHERE IMS_JOB_NUMBER = ?
        
    `;
    //======

    db.query(query, [description, assetNumber, date, imsJobNumber], (err, result) => {
        if (err) {
            console.error('Error updating repair:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No job found with the given IMS Job Number' });
        }

        res.json({ message: 'Repair updated successfully!' });
    });
});



// Test route
app.get('/', (req, res) => {
  res.send('Login API is running...');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
