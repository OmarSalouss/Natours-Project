const mongose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongose
    .connect(DB, {
        useNewURLParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log('DB connenction successful!');
    });

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
