import { Router } from 'express';
import { TimeEntryController } from '../controllers/time-entry.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createTimeEntrySchema, updateTimeEntrySchema } from '../validators/time-entry.validator';

const router = Router();
const controller = new TimeEntryController();

// Protect all time entry routes
router.use(requireAuth);

router.post('/', validate(createTimeEntrySchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateTimeEntrySchema), controller.update);
router.delete('/:id', controller.delete);

export default router;