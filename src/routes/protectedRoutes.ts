// src/routes/protectedRoutes.js
import express from 'express';
import authenticateToken from '../middlewares/authMiddleware'; // Update path as necessary
import tasksController from '../controllers/tasksController';

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Adds a new task
 *     tags:
 *       - Tasks
 *     description: Creates a new task associated with the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "Description of the new task"
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized access
 */
router.post('/tasks', authenticateToken, tasksController.addTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieves all tasks
 *     tags:
 *       - Tasks
 *     description: Retrieves all tasks associated with the authenticated user.
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "New Task"
 *                   description:
 *                     type: string
 *                     example: "Description of the new task"
 *                   completed:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized access
 */
router.get('/tasks', authenticateToken, tasksController.getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retrieves a task by ID
 *     tags:
 *       - Tasks
 *     description: Retrieves a specific task by ID for the authenticated user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "New Task"
 *                 description:
 *                   type: string
 *                   example: "Description of the new task"
 *                 completed:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/tasks/:id', authenticateToken, tasksController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Updates a task by ID
 *     tags:
 *       - Tasks
 *     description: Updates a specific task by ID for the authenticated user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task"
 *               description:
 *                 type: string
 *                 example: "Updated description of the task"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized access
 */
router.put('/tasks/:id', authenticateToken, tasksController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deletes a task by ID
 *     tags:
 *       - Tasks
 *     description: Deletes a specific task by ID for the authenticated user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized access
 */
router.delete('/tasks/:id', authenticateToken, tasksController.deleteTask);

export default router;
