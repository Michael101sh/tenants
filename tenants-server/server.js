const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const server = http.createServer(app);
const port = 3001;
const baseUrl = 'http://localhost:' + port;
// server.listen(port);
server.listen(port, function () {
    console.log('Tenants server is ready at baseUrl - ' + baseUrl);
    console.log('The supported REST verbs are:');
    console.log('POST (register user): ' + '\t\t ${baseUrl}/api/registerUser');
    console.log('GET (all users): \t\t ${baseUrl}/api/getUsers');
    console.log('GET (get users with debts): \t ' +
                '${baseUrl}/api/getUsersWithDebts');
    console.log('GET (get users without debts): \t ' +
                '${baseUrl}/api/getUsersWithoutDebts');
    console.log('PUT (update user): \t\t ${baseUrl}/api/updateUser/:{key}');
    console.log('DELETE (delete user): \t\t ${baseUrl}/api/deleteUser/:key');
});

// const clientSessions = require("client-sessions");
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tenantsDB',
    {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

// create a schema
var userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    debt: Number,
});

// we need to create a model using the schema
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;


// POST /register
app.post('/api/registerUser', (req, res) => {
    var data = {
        username: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        debt: req.body.debt
    };
    User.find({username: data.username}, function(err, users) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Register operation failed!'});
        }
        // object of the user
        console.log('users are:' + users);
        if (users.length === 0) {
            var newUser = new User(data);
            newUser.save(function (err) {
                if (err) return console.error(err);
                // saved!
                res.send('The user registered successfully');
                console.log('The user registered successfully')
            });
        }
        else {
            res.send(422, {error: 'Failed, username exist!'});
        }
    });
});

// GETs all users
app.get('/api/getUsers', (req, res) => {
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Get all users operation failed'});
        }
        res.send(users);
        // object of all the users
        console.log('the users in the system are:' + users);
    });
});

// GETs users with filter
app.get('/api/getUsersWithDebts', (req, res) => {
    User.find({}).where('debt').gt(0).exec(function(err, users) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Get filtered users operation failed'});
        }
        res.send(users);
        // object of the filtered users
        console.log('the filtered users are:' + users);
    });
});


// GETs users with filter
app.get('/api/getUsersWithoutDebts', (req, res) => {
    User.find({}).where('debt').eq(0).exec(function(err, users) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Get filtered users operation failed'});
        }
        res.send(users);
        // object of the filtered users
        console.log('the filtered users are:' + users);
    });
});

//PUT update user data
app.put('/api/updateUser/:key', (req, res) => {
    User.find({username: req.params.key}, function(err, result) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Update operation failed!'});
        }
        if (result.length > 0) {
            var id = result[0]._id;
            res.send(update(id, req.body));
        } else {
            res.send(422,
                {error: 'Update operation failed, user does not exist'});
        }
    });
});

function update(id, data) {
    return User.findById(id)
        .then((modelInstance) => {
            for (var attribute in data){
                if (data.hasOwnProperty(attribute)
                        && attribute !== "_id" && data[attribute] !== ''){
                    modelInstance[attribute] = data[attribute];
                }
            }
            return modelInstance.save();
        })
        .then((modelInstance) => {
            var response = {};
            response[this.modelName] = modelInstance;
            return response;
        });
}

// DELETE user
app.delete('/api/deleteUser/:key', (req, res) => {
    // console.log('param:' + req.body.name);
    User.findOneAndRemove({username: req.params.key}, function(err) {
        if (err) {
            console.log(err);
            res.send(422, {error: 'Delete operation failed!'});
        }
        console.log('User successfully deleted!');
        res.send('User successfully deleted!');
    });
});

module.exports = app;