// src/__tests__/tasks.test.ts

import { strict as assert } from 'assert';
import { Request, Response } from 'express';
import controller from '../controllers/tasksController';  // Import the function to test
import sinon from 'sinon';
import postgres from '../db/postgres';
import { cache } from '../config/cache';

describe('Tasks Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { status: sinon.SinonStub; json: sinon.SinonStub; send: sinon.SinonStub };
  let mockClient: any;

  beforeEach(() => {
    // Mock the request object
    req = {
      body: {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      },
      params: {
        id: 1, // Mock user ID
      } as any,
      app: {
        locals: {
          user: {
            id: 1, // Mock user ID
          },
        },
      } as any,
    };

    // Mock the response object
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };

    // Mock the database client
    mockClient = {
      query: sinon.stub(), // Define the query method
      release: sinon.stub(),      
    };

    // Mock the postgres connection
    sinon.stub(postgres, 'connect').resolves(mockClient);
  });

  afterEach(() => {
    // Restore the original methods
    sinon.restore();
  });

  describe('addTask', () => {
    it('should insert a task into the database and return the task ID', async () => {
      // Set up the query result for addTask
      mockClient.query.resolves({ rows: [{ id: 1 }] }); // Simulate a successful INSERT

      await controller.addTask(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the response
      assert(res.status.calledWith(201));
      assert(res.json.calledWith({ id: 1 }));
    });
  });

  describe('getTask', () => {
    it('should retrieve all tasks for the user', async () => {
      // Set up the query result for getTask
      mockClient.query.resolves({
        rows: [
          { id: 1, title: 'Test Task', description: 'Test Description', completed: false },
          { id: 2, title: 'Another Task', description: 'Another Description', completed: true }
        ]
      });

      await controller.getTask(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the response
      assert(res.json.calledWith([
        { id: 1, title: 'Test Task', description: 'Test Description', completed: false },
        { id: 2, title: 'Another Task', description: 'Another Description', completed: true }
      ]));
    });

  });

  describe('getTaskById', () => {
    it('should retrieve a task by id for the user', async () => {

      if (req !== undefined && req.params !== undefined)
        req.params.id = '1';
      // Set up the query result for getTaskById
      mockClient.query.resolves({
        rows: [{ id: 1, title: 'Test Task', description: 'Test Description', completed: false }]
      });

      await controller.getTaskById(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the response
      assert(res.json.calledWith({
        id: 1, title: 'Test Task', description: 'Test Description', completed: false
      }));
    });

    it('should return 404 if the task is not found', async () => {
      
    if (req !== undefined && req.params !== undefined)
        req.params.id = '1';
      // Simulate no task found
      mockClient.query.resolves({ rows: [] });
      
      cache['tasks'] = undefined;
      cache[`task_1`] = undefined;

      await controller.getTaskById(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the 404 response
      assert(res.status.calledWith(404));
      assert(res.json.calledWith({ error: 'Task not found' }));
    });

  });

  describe('updateTask', () => {
    it('should update a task for the user', async () => {
      if (req !== undefined && req.params !== undefined)
        req.params.id = '1';
      req.body = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      // Simulate successful update
      mockClient.query.resolves({});

      await controller.updateTask(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the 200 response
      assert(res.status.calledWith(200));
      assert(res.send.calledOnce);
    });

    it('should return 404 if the task to update is not found', async () => {
      if (req !== undefined && req.params !== undefined)
        req.params.id = '1';
      req.body = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      // Simulate task not found
      mockClient.query.resolves({ rowCount: 0 });

      await controller.updateTask(req as Request, res as Response);

      // Verify the 404 response
      assert(res.status.calledWith(404));
      assert(res.json.calledWith({ error: 'Task not found' }));
    });

  });

  describe('deleteTask', () => {
    it('should delete a task for the user', async () => {
      if (req !== undefined && req.params !== undefined)
        req.params.id = '1';

      // Simulate successful deletion
      mockClient.query.resolves({});

      await controller.deleteTask(req as Request, res as Response);

      // Verify that the query was called with correct parameters
      assert(mockClient.query.calledOnce);

      // Verify the 204 response
      assert(res.status.calledWith(204));
      assert(res.send.calledOnce);
    });

    it('should return 404 if the task to delete is not found', async () => {
      if (req !== undefined && req.params !== undefined)
        req.params.id = '1';

      // Simulate task not found
      mockClient.query.resolves({ rowCount: 0 });

      await controller.deleteTask(req as Request, res as Response);

      // Verify the 404 response
      assert(res.status.calledWith(404));
      assert(res.json.calledWith({ error: 'Task not found' }));
    });

  });
});
