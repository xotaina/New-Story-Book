const User = require("./User");
const Story = require("./Stories");

User.hasMany(Story, {
  foreignKey: "user_id",
});

Story.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "cascade",
});

module.exports = { 
  User, 
  Story
};
