import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { registerOrganizationSchema, loginSchema } from '../validators/auth.validator';

const router = Router();
const controller = new AuthController();

// Updated to the standard SaaS onboarding endpoint name
router.post('/register-organization', validate(registerOrganizationSchema), controller.registerOrganization);
router.post('/login', validate(loginSchema), controller.login);

export default router;