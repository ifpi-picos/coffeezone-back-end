import express from 'express';
import cors from 'cors';
import routers from "./routers/index";

const app = express();

// app.use(cookieParse());
app.use(
  cors({
    // origin: 'http://localhost:3000',
    origin: 'https://coffeezonemambee.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);
app.use(express.json());
app.use('/', routers);

app.listen(3001, () => {
  console.log('server funcionando')
});