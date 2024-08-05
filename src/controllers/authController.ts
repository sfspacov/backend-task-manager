import { Request, Response } from 'express';
import { User } from '../models/user';
import postgres from '../db/postgres';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";
import nodemailer from 'nodemailer';
import { cache } from '../config/cache';
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const saltRounds = 10; // Number of rounds for hashing

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

const validateCredentials = async (res: Response, user: User) => {
  const client = await postgres.connect();
  try {
    const result = await client.query<User>('SELECT * FROM users WHERE email = $1', [user.email]);
    const selectedUser = result.rows[0];

    if (!selectedUser) {
      return false
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(user.password, selectedUser.password);

    if (!isMatch) {
      return false
    }

    return true;

  } finally {
    client.release();
  }
}

const login = async (req: Request, res: Response) => {
  if (JWT_SECRET == "")
    return res.status(500).json({ message: "Invalid jwt_secret" });

  const user: User = {
    email: req.body.email,
    password: req.body.password
  };

  if (!user.email || !user.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const validCredentials = await validateCredentials(res, user);
  if (validCredentials === false)
    return res.status(401).json({ message: 'Invalid credentials' });
  
  cache['tasks'] = undefined;
  
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
};

const forgotPassword = async (req: Request, res: Response) => {
  const emailTo = req.body.email;
  const tempPassword = crypto.randomBytes(20).toString('hex');
  const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

  const client = await postgres.connect();
  try {
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [hashedPassword, emailTo]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Send email with Nodemailer
    const msg = {
      from: 'no-replys@task-manager.com',
      to: emailTo,
      subject: 'Reset password',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f9;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .content {
                  color: #333333;
                  font-size: 16px;
                  line-height: 1.5;
                  padding: 20px;
                  border-bottom: 2px solid #f0f0f5;
              }
              .footer {
                  padding: 10px;
                  font-size: 12px;
                  color: #888888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  Your temporary password is: ${tempPassword}
                  Access this link to change it: <a href="http://localhost:3000/changePassword">http://localhost:3000/changePassword</a>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
    };

    transporter.sendMail(msg, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
      }
      console.log('Email sent: ' + info.response);
      return res.status(201).json({
        email: emailTo,
        message: `Temporary password sent to ${emailTo}.`,
      });
    });
  } finally {
    client.release();
  }
}

const resetPassword = async (req: Request, res: Response) => {
  const currentPassword= req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const user: User = {
    email:req.body.email,
    password:currentPassword
  };
  const validCredentials = await validateCredentials(res, user);
  if (validCredentials === false)
    return res.status(401).json({ message: 'Invalid credentials' });

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const client = await postgres.connect();
  try {
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, user.email]
    );
    return res.status(201).json(result.rows[0]);
  } finally {
    client.release();
  }
};

const signUp = async (req: Request, res: Response) => {
  const user: User = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const client = await postgres.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [user.email, hashedPassword]
      );
      return res.status(201).json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export default {
  login,
  resetPassword,
  signUp,
  forgotPassword
};
