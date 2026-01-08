import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';

import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';

const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://10.10.20.48:3000'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));
//Not Found

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! From claim insurance server with rongila');
});

app.use(globalErrorHandler);

app.use(notFound);
export default app;
