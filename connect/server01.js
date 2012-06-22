var connect = require('connect');
var url = require('url');

/**
 * Checks given request;
 * If req.url is not equal to '/' responds with 404 page and returns true;
 * otherwise returns false.
 */
function checkFor404(req, res) {
  var requestedUrl = url.parse(req.url).pathname; //now we have clean url, without GET parameters (if any)
  if (requestedUrl != '/') {
    //respond with 404
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("Page not found");
    res.end();
    return true;
  }

  //if url is legal and must be processed by handler
  return false;
}


function mainPage(req, res) {
  if (checkFor404(req, res)) {
    return;
  }

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("This is main page");
  res.end();
}

function anotherPage(req, res) {
  if (checkFor404(req, res)) {
    return;
  }

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("And this is another page");
  res.end();
}

var app = connect() ;
app.use('/another', anotherPage);
app.use('/', mainPage);
app.listen(8080);


