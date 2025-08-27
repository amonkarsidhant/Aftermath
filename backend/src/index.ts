import express from 'express';
import incidents from './routes/incidents';
import postmortems from './routes/postmortems';
import actions from './routes/actions';
import metrics from './routes/metrics';

const app = express();
const port = process.env.PORT || 3000;

app.use('/incidents', incidents);
app.use('/postmortems', postmortems);
app.use('/actions', actions);
app.use('/metrics', metrics);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
