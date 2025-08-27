import express from 'express';
import incidents from './routes/incidents';
import postmortems from './routes/postmortems';
import actions from './routes/actions';
import metrics from './routes/metrics';
import authRoutes from './routes/auth';
import authMiddleware from './middleware/auth';
import errorHandler from './middleware/errorHandler';

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/incidents', authMiddleware, incidents);
app.use('/postmortems', authMiddleware, postmortems);
app.use('/actions', authMiddleware, actions);
app.use('/metrics', authMiddleware, metrics);

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
