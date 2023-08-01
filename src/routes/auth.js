import * as controllers from '../controllers';
import express from 'express';

const router = express.Router()

router.post('/register',controllers.registerUser);
router.post('/login',controllers.loginUser);
router.post('/refresh-token',controllers.refreshTokenController);

module.exports = router