import { selectAbilites } from '@controllers/measure/behavioralController';
import { Router } from 'express';

const behavioralRouter = Router();

behavioralRouter.post("/selectAbilites", selectAbilites);

// behavioralRouter.post('/measure', upload.single('video'), measureVideo);

export default behavioralRouter;
