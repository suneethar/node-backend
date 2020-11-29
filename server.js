const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const db = require('./app/models');
const { count } = require('./app/models/user.model');
const Role = db.role;
require('./app/routes/auth.routes')(app);

db.mongoose.connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('Successfully connected to DB.')
    initialize();
}).catch(err => {
    console.error('Error connecting to DB', err);
    process.exit();
})

function initialize() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: 'user'
            }).save(err => {
                if (err) {
                    console.log('error')
                }
                console.log("Added 'user' to role collection")
            });
            new Role({
                name: 'admin'
            }).save(err => {
                if (err) {
                    console.log(err)
                }
                console.log("Added 'admin' to role collection")
            })
        }
    })
}

var corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({message: 'Welcome !'})
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})