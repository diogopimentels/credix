import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import rateLimit from 'express-rate-limit';

import { routes } from './shared/infra/http/routes';
import { globalErrorHandler } from './shared/infra/http/middlewares/globalErrorHandler';

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(routes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
