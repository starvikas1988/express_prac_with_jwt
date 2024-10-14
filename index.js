const express = require("express");
const app = express();
const dotenv = require('dotenv');
const router = require("./Routes/userRoutes");
const verify = require("./Middleware/verifyMiddleware");
const mongoose =  require("mongoose");
const cors = require('cors');
dotenv.config();

app.use(express.json());  // Ensure this line is present in your index.js
app.use(cors());

// var bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log('Connectd to DB!');
})

app.use('/api/v1/user',router);

// Protected route example
app.get('/api/v1/protected', verify, (req, res) => {
    res.status(200).json({
        message: "Access granted to protected route",
        user: {
            email: req.email,
            userId: req.userId
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(process.env.PORT || 5001,()=>{
    console.log(`Listening to PORT: ${process.env.PORT}`)
})