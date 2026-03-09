import { Router } from 'express';
import { presetController } from '../controllers/presetController';
import { validateCreatePreset } from '../middleware/validation';

const router = Router();

router.get('/', presetController.getAll);
router.get('/:id', presetController.getById);
router.post('/', validateCreatePreset, presetController.create);
router.delete('/:id', presetController.delete);

export default router;
