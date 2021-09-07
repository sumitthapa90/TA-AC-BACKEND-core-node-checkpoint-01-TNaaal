var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
  let store = "";
  req.on("data", (chunk) => {
    store = store + chunk;
  });
  req.on("end", () => {
    if (req.method === "GET" && req.url === "/") {
      res.setHeader("Content- Type", "text/html");
      fs.createReadStream("./index.html").pipe(res);
    } else if (req.url === "/about") {
      res.setHeader("Content-Type", "text/html");
      fs.createReadStream("./about.html").pipe(res);
    } else if (
      req.url.split(".").pop() === "jpg" ||
      req.url.split(".").pop() === "png"
    ) {
      let imgFormate = req.url.split(".").pop();
      res.setHeader("Content-Type", `${imgFormate}`);
    } else if (req.url.split(".").pop() === "js") {
      res.setHeader("Content-Type", "text/js");
      fs.createReadStream(`${req.url}`).pipe(res);
    }else if(req.url === "./contact" && req.method === "GET"){
      
    }
  });
}

server.listen(5000, () => {
  console.log("Server listing at port 5000");
});
