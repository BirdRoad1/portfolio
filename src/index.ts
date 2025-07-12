import express from 'express';
import { APIRouter } from './routes/api-route.js';
import './env.js';

const app = express();

app.use(
  express.static('web/', {
    extensions: ['html']
  })
);

app.use('/api', APIRouter);

app.listen(8000, () => {
  console.log('Listening on http://127.0.0.1:8000');
});
