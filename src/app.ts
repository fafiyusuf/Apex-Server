// app.ts
import cors from 'cors';
import express from 'express';
import userRoute from './routes/userRoute';


const app = express();

app.use(cors());


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express + TypeScript + MongoDB Server');
});

 app.use('/users', userRoute);

export default app;
