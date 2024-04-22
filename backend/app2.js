import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { defaultImage , defaultJobImage , defaultItemImage } from "./defaultImage.js"
import bodyParser from 'body-parser'    
const app=express()
app.use(bodyParser.json());
import mysql from 'mysql'

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'dinesh',
  password: '1234',
  database: 'delta'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);

  // Create the users table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(20),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      alumnus BOOLEAN
    )
  `;

  connection.query(createTableQuery, (error) => {
    if (error) {
      console.error('Failed to create table: ' + error);
      return;
    }
    console.log('Table created or already exists');
  });
});

// Endpoint for creating a new user
app.post("/auth/create-user" , async (req, res) => {
  // Validate request body
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message : "All the fields are required",
    });
  }

  // Extract data from the request body
  const { name, phoneNumber, email, password, alumnus } = req.body;

  // Insert user data into the database
  const userData = {
    name,
    phoneNumber,
    email,
    password,
    alumnus
  };

  const sql = 'INSERT INTO users SET ?';

  // Execute the SQL query
  connection.query(sql, userData, (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Duplicate email error
        return res.status(400).send({
          message : "Email already exists",
        });
      }
      console.error('Failed to create user: ' + error);
      return res.status(500).send({
        message : "Failed to create user",
      });
    }
    console.log('User created successfully');
    return res.status(201).send({
      message: "User created successfully",
      user: userData,
    });
  });
});

// Close the connection when the Node.js process ends
process.on('SIGINT', () => {
  connection.end();
});



app.listen(5000,function(){
    console.log("Listening on port 5000");
  })
