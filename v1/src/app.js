const express = require("express");
const helmet = require("helmet");
const config = require("./config")
const loaders = require("./loaders")
const events = require("./scripts/events")
const path = require("path")

const { ProjectRoute, UserRoute, SectionRoute, TaskRoute } = require("./api-routes");
const fileUpload = require("express-fileupload");

config();
loaders();
events();

const app =  express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")))
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
    console.log("Sunucu ayağa kalktı..");
    app.use("/projects", ProjectRoute);
    app.use("/users", UserRoute);
    app.use("/sections", SectionRoute);
    app.use("/tasks", TaskRoute);

})