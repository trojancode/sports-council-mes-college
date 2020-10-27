const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const audioRoutes = require('./routes/audio')


//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => console.log("DB Connected"))
    .catch((ero) => console.log(ero));

//midddleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


 
//routes middlewares
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',audioRoutes);


// app.use(express.static("build"));
// app.use('/*',express.static("build"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`server runnig on por:${port}`);
})