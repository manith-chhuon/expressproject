import {Router} from 'express';
const router = Router();
import { getAllUsers,createUser,login,loginUser,listUser,findUser } from '../controllers/userController.js';    
import { isAuth, isGuest } from '../middleware/authMiddleware.js';

router.get('/create', isAuth ,getAllUsers);
router.post('/create', createUser);

// Public / Guest Only
router.get('/login',isGuest, login);
router.post('/login', loginUser);

// Protected / Auth Only
router.get('/dashboard', isAuth, listUser);
router.post('/dashboard', isAuth,  findUser);
// // Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
export default router;