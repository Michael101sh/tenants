# tenants-server

## Setup and run

``` bash
# install dependencies
npm install

# run the MongoDB database
install MongoDB and run it by following the instruction in the following link:
https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/ 

# run the server   
npm start
```

# How to use

### supported REST verbs - POST,GET, PUT, DELETE

Tenants server run at baseUrl - http://localhost:3001  
The supported REST verbs are:  
POST (register user):            ${baseUrl}/api/registerUser  
GET (all users):                 ${baseUrl}/api/getUsers  
GET (get users with debts):      ${baseUrl}/api/getUsersWithDebts  
GET (get users without debts):   ${baseUrl}/api/getUsersWithoutDebts  
PUT (update user):               ${baseUrl}/api/updateUser/:{key}  
DELETE (delete user):            ${baseUrl}/api/deleteUser/:key

