import { Router } from 'express';
import multer from 'multer';
import { measureVideo } from '@controllers/measure/behavioralController';

const upload = multer({ dest: 'uploads/' });
const behavioralRouter = Router();

behavioralRouter.post('/measure', upload.single('video'), measureVideo);

export default behavioralRouter;
