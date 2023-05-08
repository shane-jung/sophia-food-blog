import express, {Request, Response} from 'express';
import commentController from '../controllers/commentController';
import checkAuth from '../middleware/checkAuth';


import multer from 'multer';
var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/')
    .post(upload.none(),commentController.postComment);

router.get('/:commentID', commentController.getCommentById)
      .delete('/:commentID', commentController.deleteComment);


export default router; 