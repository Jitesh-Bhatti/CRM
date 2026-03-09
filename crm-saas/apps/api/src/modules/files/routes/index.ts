import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validate.middleware';
import { uploadFileSchema } from '../validators/file.validator';
import { uploadMiddleware } from '../middleware/upload.middleware';

const router = Router();
const controller = new FileController();

// Protect all file routes
router.use(requireAuth);

// Notice how we inject uploadMiddleware.single('file') before the controller!
router.post('/upload', uploadMiddleware.single('file'), validate(uploadFileSchema), controller.upload);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);

export default router;