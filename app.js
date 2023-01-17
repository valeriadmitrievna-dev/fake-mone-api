const jsonServer = require("json-server");
const server = jsonServer.create();
const generateDB = require('./generate')
const DB = generateDB()
const router = jsonServer.router(DB);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running");
});
