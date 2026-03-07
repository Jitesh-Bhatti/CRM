import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { LeadController } from '../controllers/lead.controller';
import { ClientContactController } from '../controllers/client-contact.controller';
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createClientSchema, updateClientSchema } from '../validators/client.validator';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';
import { createClientContactSchema, updateClientContactSchema } from '../validators/client-contact.validator';

const router = Router();
const clientController = new ClientController();
const leadController = new LeadController();
const contactController = new ClientContactController();

// Protect all CRM routes
router.use(requireAuth);

// --- Client Routes ---
router.post('/clients', validate(createClientSchema), clientController.create);
router.get('/clients', clientController.getAll);
router.get('/clients/:id', clientController.getById);
router.patch('/clients/:id', validate(updateClientSchema), clientController.update);
router.delete('/clients/:id', clientController.delete);

// --- Client Contacts Routes ---
// Notice how these are nested underneath the specific client ID
router.post('/clients/:clientId/contacts', validate(createClientContactSchema), contactController.create);
router.get('/clients/:clientId/contacts', contactController.getAll);
router.get('/clients/:clientId/contacts/:id', contactController.getById);
router.patch('/clients/:clientId/contacts/:id', validate(updateClientContactSchema), contactController.update);
router.delete('/clients/:clientId/contacts/:id', contactController.delete);

// --- Lead Routes ---
router.post('/leads', validate(createLeadSchema), leadController.create);
router.get('/leads', leadController.getAll);
router.get('/leads/:id', leadController.getById);
router.patch('/leads/:id', validate(updateLeadSchema), leadController.update);
router.delete('/leads/:id', leadController.delete);

export default router;