const seedUsers = require("./user-seeds");
const seedStories = require("./story-seeds");
const seedComments = require("./comment-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  await seedUsers();
  await seedStories();
  await seedComments();
  process.exit(0);
};

seedAll();
