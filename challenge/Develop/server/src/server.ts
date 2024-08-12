import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
