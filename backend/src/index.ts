import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import summary from './routes/summary';
import timeline from './routes/timeline';
import authRoutes from './routes/auth';
import authMiddleware from './middleware/auth';
import shareRoutes from './routes/share';
import shareAuth from './middleware/shareAuth';
import rbac from './middleware/rbac';
import errorHandler from './middleware/errorHandler';
import logger from './middleware/logger';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { searchPostmortems } from './search';

const app = express();
const port = Number(process.env.PORT) || 5000;

const useMockData = process.env.USE_MOCK_DATA === 'true';

const incidents = (useMockData
  ? require('./mock/incidents')
  : require('./routes/incidents')).default;
const postmortems = (useMockData
  ? require('./mock/postmortems')
  : require('./routes/postmortems')).default;
const actions = (useMockData
  ? require('./mock/actions')
  : require('./routes/actions')).default;
const metrics = (useMockData
  ? require('./mock/metrics')
  : require('./routes/metrics')).default;

if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.error('JWT_SECRET is not defined');
  process.exit(1);
}

app.use(express.json());
app.use(logger);

const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/share', authMiddleware, shareRoutes);
app.use('/incidents', shareAuth, incidents);
app.use('/postmortems', shareAuth, postmortems);
app.use('/actions', authMiddleware, rbac(['sre']), actions);
app.use('/metrics', authMiddleware, rbac(['manager']), metrics);
app.use('/summary', authMiddleware, summary);
app.use('/timeline', shareAuth, timeline);

const schema = buildSchema(`
  type Postmortem {
    id: ID!
    incidentId: String!
    title: String!
    summary: String!
    tags: [String!]!
  }

  type Query {
    searchPostmortems(q: String!): [Postmortem!]!
  }
`);

app.use(
  '/graphql',
  authMiddleware,
  graphqlHTTP({
    schema,
    rootValue: {
      searchPostmortems: ({ q }: { q: string }) => searchPostmortems(q),
    },
    graphiql: true,
  })
);

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
