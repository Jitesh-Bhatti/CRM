import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ProjectMemberController } from '../controllers/project-member.controller';
import { MilestoneController } from '../controllers/milestone.controller';
import { RequirementController } from '../controllers/requirement.controller';
import { ChangeRequestController } from '../controllers/change-request.controller'; // <-- Add Import
import { validate } from '../../../middleware/validate.middleware'; 
import { requireAuth } from '../../../middleware/auth.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';
import { createProjectMemberSchema, updateProjectMemberSchema } from '../validators/project-member.validator';
import { createMilestoneSchema, updateMilestoneSchema } from '../validators/milestone.validator';
import { createRequirementSchema, updateRequirementSchema } from '../validators/requirement.validator';
import { createChangeRequestSchema, updateChangeRequestSchema } from '../validators/change-request.validator'; // <-- Add Import

const router = Router();
const projectController = new ProjectController();
const memberController = new ProjectMemberController();
const milestoneController = new MilestoneController();
const requirementController = new RequirementController();
const changeRequestController = new ChangeRequestController(); // <-- Init Controller

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

// --- Milestone Routes ---
router.post('/:projectId/milestones', validate(createMilestoneSchema), milestoneController.create);
router.get('/:projectId/milestones', milestoneController.getAll);
router.get('/:projectId/milestones/:id', milestoneController.getById);
router.patch('/:projectId/milestones/:id', validate(updateMilestoneSchema), milestoneController.update);
router.delete('/:projectId/milestones/:id', milestoneController.delete);

// --- Requirement Routes ---
router.post('/:projectId/requirements', validate(createRequirementSchema), requirementController.create);
router.get('/:projectId/requirements', requirementController.getAll);
router.get('/:projectId/requirements/:id', requirementController.getById);
router.patch('/:projectId/requirements/:id', validate(updateRequirementSchema), requirementController.update);
router.delete('/:projectId/requirements/:id', requirementController.delete);

// --- Change Request Routes ---
router.post('/:projectId/change-requests', validate(createChangeRequestSchema), changeRequestController.create);
router.get('/:projectId/change-requests', changeRequestController.getAll);
router.get('/:projectId/change-requests/:id', changeRequestController.getById);
router.patch('/:projectId/change-requests/:id', validate(updateChangeRequestSchema), changeRequestController.update);
router.delete('/:projectId/change-requests/:id', changeRequestController.delete);

export default router;