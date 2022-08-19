const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! SHUTTING DOWN');
  console.log(err);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MOGNO DB CONNECTED'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UnhandledRejection! SHUTTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', (err) => {
  console.log(err.name, err.message);
  console.log('SIGTERM RECEIVED! SHUTTING DOWN NICELY');
  server.close(() => {
    CONSOLE.log('Process terminated!');
  });
});
