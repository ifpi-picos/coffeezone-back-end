import express from 'express';
import cors from 'cors';
import routers from "./routers/index";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.URL_SITE,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);
app.use('/', routers);

app.listen(3001, () => {
  console.log('server funcionando')
});