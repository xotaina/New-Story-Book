const {user} = require('../models');

const userData = [{
    username: "Example1",
    password: "Example1"
},
{
    username: "Example 2",
    password: "Example 2"
},
{
    username: "Example 3",
    password: "Example 3"
}];

const seedUsers = () => user.bulkCreate(userData);

model.exports = seedUsers;