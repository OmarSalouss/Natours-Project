const mongose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
  // EX: uncorrecet DATABASE PASSWORD
});

process.on('uncaughtException', err => {
  console.log('UNHANDLED EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
  // EX: console.log(x); // x not define 
});



dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => {
    console.log('DB connenction successful!')
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

