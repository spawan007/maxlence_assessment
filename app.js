import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import client from './config/redis.js';
import sequelize from './config/db.js';

import indexRouter from './routes/index.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());

(async () => {
  try {
    await sequelize.authenticate(); 
    console.log('Database connected sucessfully');
    await sequelize.sync(); 

    await client.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
