var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
  console.log(req.url, req.method);
  let parsedURL = url.parse(req.url, true);
  let store = "";
  req.on("data", (chunk) => {
    store = store + chunk;
  });
  req.on("end", () => {
    if (req.url === "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html");
      fs.createReadStream("./index.html").pipe(res);
    } else if (req.url === "/about") {
      res.setHeader("Content-Type", "text/html");
      fs.createReadStream("./about.html").pipe(res);
    } else if (req.url.split(".").pop() === "css") {
      res.setHeader("Content-Type", "text/css");
      fs.createReadStream(`./assets${req.url}`).pipe(res);
    } else if (req.url.split(".").pop() === "js") {
      res.setHeader("Content-Type", "text/js");
      fs.createReadStream(`./${req.url}`).pipe(res);
    } else if (
      req.url.split(".").pop() === "jpg" ||
      req.url.split(".").pop() === "png"
    ) {
      let imageFormat = req.url.split(".").pop();
      res.setHeader("Content-Type", `image/${imageFormat}`);
      return fs.createReadStream(`./assets${req.url}`).pipe(res);
    } else if (req.url === "/contact" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });
      return fs.createReadStream("./form.html").pipe(res);
    } else if (req.url === "/form" && req.method === "POST") {
      let parsedData = qs.parse(store);
      let username = parsedData.username;
      console.log(parsedData, username);
      let userPath = __dirname + "/contacts/";
      console.log(userPath);
      fs.open(userPath + username + ".json", "wx", (err, fd) => {
        if (err) console.log(`${username} is adready exits`);
        fs.write(fd, JSON.stringify(parsedData), (err) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) return console.log(err);
            else {
              return res.end("Contact saved");
            }
          });
        });
      });
    } else if (parsedURL.pathname === "/users" && req.method === "GET") {
      let user = parsedURL.query.username;
      fs.readFile(userPath + username + ".json", (err, content) => {
        if (err) return console.log(err);
        res.setHeader("Content-Type", "application/json");
        return res.end(content);
      });
    } else if (parsedURL.pathname === "./users" && req.method === "PUT") {
      var username = parsedURL.query.username;
      fs.open(userPath.username + ".json" + "r+", (err, fd) => {
        if (err) return console.log(err);
        fs.ftruncate(fd, (err) => {
          if (err) return console.log(err);
          fs.writeFile(fd, store, (err, content) => {
            if (err) return console.log(err);
            fs.close((fd) => {
              return res.end(`${username} updated sucessfully`);
            });
          });
        });
      });
    } else if (parsedURL.pathname === "/users" && req.method === "DELETE") {
      var username = parsedURL.query.username;
      fs.unlink(userPath + username + ".json", (err, content) => {
        if (err) console.log(err);
        return res.end(`${username} is deleted`);
      });
    }
    res.statusCode = 404;
    res.end("Page not found");
  });
}

server.listen(5000, () => {
  console.log("Server listing at port 5000");
});
