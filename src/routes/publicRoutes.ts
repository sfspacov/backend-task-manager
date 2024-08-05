// src/routes/publicRoutes.js
import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 *   - name: Tasks
 *     description: Endpoints related to task management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags:
 *       - Authentication
 *     description: Authenticates a user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt.token.here
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /recover-password:
 *   put:
 *     summary: Request a temporary password for the user to reset their password.
 *     description: This endpoint generates a temporary password for the user and sends it to the provided email address. The temporary password can be used to reset the user's password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Email address to send the temporary password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user requesting password reset.
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Temporary password generated and email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address where the temporary password was sent.
 *                 message:
 *                   type: string
 *                   example: "Temporary password sent to user@example.com."
 *       400:
 *         description: Bad Request. Email not provided or other validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email address is required."
 *       404:
 *         description: Not Found. User with the specified email does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while resetting the password."
 */
router.put('/recover-password', authController.forgotPassword);

/**
 * @swagger
 * /reset-password:
 *   put:
 *     summary: Resets the user's password.
 *     description: This endpoint allows users to reset their password by providing their email and new password. The password is securely hashed before being updated in the database.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user whose password is being reset.
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the user whose password was reset.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                 password:
 *                   type: string
 *                   description: The hashed password.
 *               example:
 *                 id: 1
 *                 email: user@example.com
 *                 password: "$2b$10$4V7OUmKDdE/r5WqFzJpOReGh9n2o3IFQ2IcQXzK2Nh7H45rzAGXZm"
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining what went wrong.
 *               example:
 *                 message: "Invalid email or password."
 *       500:
 *         description: Internal Server Error - An unexpected error occurred on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the server-side issue.
 *               example:
 *                 message: "An unexpected error occurred."
 */
router.put('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Add a new user
 *     description: Creates a new user with a hashed password and stores it in the database.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier of the created user.
 *               required:
 *                 - id
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post('/signUp', authController.signUp)

export default router;
