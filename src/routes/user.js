import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verify_token';
import{ isAdmin,isModeratorOrAdmin} from "../middlewares/verify_roles"

const router = express.Router()

//pulic router 



//private routes 
router.use(verifyToken)
// router.use(isModeratorOrAdmin)
router.get('/',controllers.getCurrent);

module.exports = router