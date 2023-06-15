import express, {Request, Response} from 'express';
import commentController from '../controllers/commentController';

const router = express.Router();

router.route('/')
    .post(commentController.postComment);

router.get('/:commentId', commentController.getCommentById)
      .delete('/:commentId', commentController.deleteComment);

router.post('/:commentId/like', commentController.handleLike)
router.post('/:commentId/delete', commentController.deleteComment)


export default router; 