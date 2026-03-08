import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskCommentController } from '../controllers/task-comment.controller'; // <-- Add Import
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';
import { createTaskCommentSchema, updateTaskCommentSchema } from '../validators/task-comment.validator'; // <-- Add Import

const router = Router();
const taskController = new TaskController();
const commentController = new TaskCommentController(); // <-- Init Controller

// Protect all task routes
router.use(requireAuth);

// --- Core Task Routes ---
router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

// --- Task Comment Routes ---
router.post('/:taskId/comments', validate(createTaskCommentSchema), commentController.create);
router.get('/:taskId/comments', commentController.getAll);
router.get('/:taskId/comments/:id', commentController.getById);
router.patch('/:taskId/comments/:id', validate(updateTaskCommentSchema), commentController.update);
router.delete('/:taskId/comments/:id', commentController.delete);

export default router;