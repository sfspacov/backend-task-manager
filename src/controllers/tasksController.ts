import { Request, Response } from 'express';
import { Task } from '../models/task';
import postgres from '../db/postgres';
import { cache } from '../config/cache';

const addTask = async (req: Request, res: Response) => {
  const task: Task = {
    id: 0,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  };

  const client = await postgres.connect();
  try {
    const userEmail = req.app.locals.user.email;
    const result = await client.query(
      'INSERT INTO tasks (title, description, completed, user_email) VALUES ($1, $2, $3, $4) RETURNING id',
      [task.title, task.description, task.completed == false ? "false" : "true", userEmail]
    );
    // Clear the cache as the task list has changed
    cache['tasks'] = undefined;
    
    return res.status(201).json(result.rows[0])
  } finally {
    client.release();
  }
};

const getTask = async (req: Request, res: Response) => {
  const cacheKey = 'tasks';
  
  if (cache[cacheKey]) {
    return res.json(cache[cacheKey]);
  }

  const client = await postgres.connect();
  try {
    const userEmail = req.app.locals.user.email;
    const result = await client.query<Task>('SELECT * FROM tasks WHERE user_email = $1', [userEmail]);

    // Update cache
    cache[cacheKey] = result.rows;
    
    return res.json(result.rows);
  } finally {
    client.release();
  }
};

const getTaskById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const cacheKey = `task_${id}`;
  
  if (cache[cacheKey]) {
    return res.json(cache[cacheKey]);
  }

  const client = await postgres.connect();
  try {
    const result = await client.query('SELECT * FROM tasks WHERE id = $1 AND user_email = $2', [id, req.app.locals.user.email]);

    if (result.rows.length === 0) {
      // Task not found
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update cache
    cache[cacheKey] = result.rows[0];
    
    return res.json(result.rows[0]);
  }
  catch (error) {
    // Handle any errors that may occur
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const updateTask = async (req: Request, res: Response) => {
  const task: Task = {
    id: Number(req.params.id),
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  };
  const client = await postgres.connect();
  try {
    const userEmail = req.app.locals.user.email;
    const result = await client.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_email = $5',
      [task.title, task.description, task.completed == false ? "false" : "true", task.id.toString(), userEmail]
    );
    if (result.rowCount === 0) {
      // Task not found or not updated
      return res.status(404).json({ error: 'Task not found' });
    }

    // Clear the cache as the task list and specific task details may have changed
    cache['tasks'] = undefined;
    cache[`task_${task.id}`] = undefined;

    // Task updated successfully
    return res.status(200).send();
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const id = req.params.id;
  const client = await postgres.connect();
  try {
    const userEmail = req.app.locals.user.email;
    const result = await client.query('DELETE FROM tasks WHERE id = $1 AND user_email = $2', [id, userEmail]);

    if (result.rowCount === 0) {
      // Task not found
      return res.status(404).json({ error: 'Task not found' });
    }

    // Clear the cache as the task list and specific task details may have changed
    cache['tasks'] = undefined;
    cache[`task_${id}`] = undefined;

    // Task deleted successfully
    return res.status(204).send();
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

export default {
  addTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask
};
