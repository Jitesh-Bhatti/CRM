import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ProjectMemberController } from '../controllers/project-member.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';
import { createProjectMemberSchema, updateProjectMemberSchema } from '../validators/project-member.validator';

const router = Router();
const projectController = new ProjectController();
const memberController = new ProjectMemberController();

// All project routes are protected
router.use(requireAuth);

// --- Core Project Routes ---
router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.patch('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);

// --- Project Members Routes ---
router.post('/:projectId/members', validate(createProjectMemberSchema), memberController.create);
router.get('/:projectId/members', memberController.getAll);
router.get('/:projectId/members/:id', memberController.getById);
router.patch('/:projectId/members/:id', validate(updateProjectMemberSchema), memberController.update);
router.delete('/:projectId/members/:id', memberController.delete);

export default router;