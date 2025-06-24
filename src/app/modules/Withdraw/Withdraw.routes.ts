import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WithdrawController } from './Withdraw.controller';
import { WithdrawValidation } from './Withdraw.validation';

const router = express.Router();

router.post(
'/',
auth(),
validateRequest(WithdrawValidation.createSchema),
WithdrawController.createWithdraw,
);

router.get('/', auth(), WithdrawController.getWithdrawList);

router.get('/:id', auth(), WithdrawController.getWithdrawById);

router.put(
'/:id',
auth(),
validateRequest(WithdrawValidation.updateSchema),
WithdrawController.updateWithdraw,
);

router.delete('/:id', auth(), WithdrawController.deleteWithdraw);

export const WithdrawRoutes = router;