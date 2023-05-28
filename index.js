const express = require("express");
const dotenv = require("dotenv");
const hbs = require("express-handlebars");
const path = require("path");
const sequelize = require("./config/connection");
const User = require('./models/User')
const Story = require('./models/Stories')
const session = require('express-session');
const {format_date,stripTags,truncate,edit,select,sN} = require('./utils/helpers')

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false, 
  saveUninitialized: true 
}));

app.use(express.urlencoded({ extended: false }));


app.engine(
  "hbs",
  hbs.create({
    extname: "hbs",
    defaultLayout: "main",
    helpers:{
      format_date,
      stripTags,
      truncate,
      edit,
      select,
      sN
    }
  }).engine
);

app.set("view engine", "hbs");

// routes
app.use("/", require("./routes/auth"));
app.use("/stories/", require("./routes/stories"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || '8080';
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
  User.sync({force: false})
  Story.sync({force: false})
    app.set('port',PORT)
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    })
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

