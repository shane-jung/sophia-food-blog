import express, {Request, Response} from 'express';
import commentController from '../controllers/commentController';

const router = express.Router();

router.route('/')
    .post(commentController.postComment);

router.get('/:commentID', commentController.getCommentById)
      .delete('/:commentID', commentController.deleteComment);

router.post('/:commentID/like', commentController.handleLike)


export default router; 