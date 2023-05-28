const { Model, DataTypes,Sequelize } = require("sequelize");
// const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  // checkPwd(loginPwd) {
  //   return bcrypt.compareSync(loginPwd, this.password);
  // }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
  },
  {
    hooks: {
      // async beforeCreate(newUser) {
      //   newUser.password = await bcrypt.hash(newUser.password, 10);
      //   return newUser;
      // },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
