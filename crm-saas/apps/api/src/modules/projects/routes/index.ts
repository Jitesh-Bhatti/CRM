import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();
const controller = new ProjectController();

// All project routes are protected
router.use(requireAuth);

router.post('/', validate(createProjectSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateProjectSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;