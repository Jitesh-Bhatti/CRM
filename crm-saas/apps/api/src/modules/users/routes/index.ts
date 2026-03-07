import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();
const controller = new UserController();

// All user routes require authentication
router.use(requireAuth);

router.post('/', validate(createUserSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateUserSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;