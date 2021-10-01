// INITIALISATIONS
require("dotenv").config();
const express = require("express");
const app = express();



//MIDDLEWARES
const cors = require("cors");
app.use(express.json({ limit: '1mb', extended: true }));
app.use(cors());




//DB CONNECTION
const db = require("./config/database");
db.authenticate().then(() => {
  console.log("DB Connected");
}).catch((err) => {
  console.log("Error : " + err);
});



//ADMIN PANEL FOR TEST SERVER
// const AdminBro = require('admin-bro')
// const AdminBroExpress = require('@admin-bro/express')
// const AdminBroSequelize = require('@admin-bro/sequelize')
// AdminBro.registerAdapter(AdminBroSequelize)
// const adminBro = new AdminBro({
//   databases: [db],
//   rootPath: '/admin',
// })
// const router = AdminBroExpress.buildRouter(adminBro)
// app.use(adminBro.options.rootPath, router)



// ADMIN PANEL FOR MAIN SERVER
const router = require("./admin/adminBro");
app.use("/admin", router);


// MY ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop");
const otherRoutes = require("./routes/extras");
const courseRoutes = require("./routes/courses");
const examRoutes = require("./routes/tests");
const susbRoutes = require("./routes/subscription");
const htmlRoutes = require("./routes/htmlRouters");
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/other", otherRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/subs", susbRoutes);
app.use("/2021", htmlRoutes);

//PORT
const port = process.env.PORT || 8000;

//START SERVER
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
