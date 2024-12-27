import express from 'express';
import { isAdmin, isAuth } from '../middleware/isAuth.js';
import { addLecture, createCourse } from '../controllers/admin.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router();

router.post('/course/new',isAuth, isAdmin , uploadFiles ,createCourse);
router.post('/course/:id',isAuth,isAdmin,uploadFiles,addLecture)

export default router