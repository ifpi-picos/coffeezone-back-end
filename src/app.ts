import express from 'express';
import routers from "./routers/index";

const app = express();

app.use(express.json());
app.use('/', routers);

app.listen(3000, () => {
  console.log('server funcionando')
});