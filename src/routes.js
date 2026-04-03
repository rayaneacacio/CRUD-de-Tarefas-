import { Database } from './database.js';
import { locales } from './locales.js';
import { sendError } from './middlewares/send-error.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

const {
  REQUIRED_ITEMS_ERROR, REQUIRED_ID_ERROR, TASK_NOT_FOUND_ERROR, INVALID_COMPLETE_ERROR, MALFORMED_JSON_ERROR 
} = locales;

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { title, description } = req.query;

        const decodedTitle = title ? decodeURIComponent(title) : null;
        const decodedDescription = description ? decodeURIComponent(description) : null;

        const tasks = database.read(decodedTitle, decodedDescription);

        return res.writeHead(200).end(JSON.stringify(tasks));

      } catch {
        return sendError(res);
      }
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      try {
        if (!req.body) throw new Error(MALFORMED_JSON_ERROR);

        const { title, description } = req.body;

        const createdTask = database.create(title, description);

        return res.writeHead(201).end(JSON.stringify(createdTask));

      } catch (error) {
        if (error.message === MALFORMED_JSON_ERROR) return sendError(res, 400, MALFORMED_JSON_ERROR);

        if (error.message === REQUIRED_ITEMS_ERROR) return sendError(res, 400, REQUIRED_ITEMS_ERROR);

        return sendError(res);
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      try {
        if (!req.body) throw new Error(MALFORMED_JSON_ERROR);

        const { id } = req.params;
        const { title, description } = req.body;

        const updatedTask = database.update({id, title, description});

        return res.writeHead(200).end(JSON.stringify(updatedTask));
      
      } catch (error) {
        if (error.message === MALFORMED_JSON_ERROR) return sendError(res, 400, MALFORMED_JSON_ERROR);

        if (error.message === TASK_NOT_FOUND_ERROR) return sendError(res, 400, REQUIRED_ID_ERROR);

        return sendError(res);
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/task/:id/complete'),
    handler: (req, res) => {
      try {
        if (!req.body) throw new Error(MALFORMED_JSON_ERROR);

        const { id } = req.params;
        const { complete } = req.body;

        if (typeof complete !== 'boolean') throw new Error(INVALID_COMPLETE_ERROR);

        const updatedTask = database.update({id, isComplete: complete});

        return res.writeHead(200).end(JSON.stringify(updatedTask));
        
      } catch (error) {
        if (error.message === MALFORMED_JSON_ERROR) return sendError(res, 400, MALFORMED_JSON_ERROR);

        if (error.message === TASK_NOT_FOUND_ERROR) return sendError(res, 400, REQUIRED_ID_ERROR);

        if (error.message === INVALID_COMPLETE_ERROR) return sendError(res, 400, INVALID_COMPLETE_ERROR);

        return sendError(res);
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        
        database.delete(id);

        return res.writeHead(200).end();

      } catch (error) {
        if (error.message === TASK_NOT_FOUND_ERROR) return sendError(res, 400, REQUIRED_ID_ERROR);

        return sendError(res);
      }
    }
  }
];