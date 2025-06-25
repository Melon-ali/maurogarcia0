import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DepositController } from './Deposit.controller';
import { DepositValidation } from './Deposit.validation';

const router = express.Router();

router.post(
'/',
auth(),
validateRequest(DepositValidation.createSchema),
DepositController.createDeposit,
);

router.get('/', auth(), DepositController.getDepositList);

router.get('/:id', auth(), DepositController.getDepositById);

router.put(
'/:id',
auth(),
validateRequest(DepositValidation.updateSchema),
DepositController.updateDeposit,
);

router.delete('/:id', auth(), DepositController.deleteDeposit);

export const DepositRoutes = router;