import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../src/config/env';
import { routes } from '../src/routes';
import { errorHandler } from '../src/middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`🚀 Server started on port ${env.PORT}`);
});
