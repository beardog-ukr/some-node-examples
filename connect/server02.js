var connect = require('connect');
var url = require('url');

/**
 * This array lists all urls (and methods) alloweed for our site
 */
var allowedUrls = [
  {path: new RegExp('^/?$'), method:'GET'},
  {path: new RegExp('^/upload/?$'), method:'GET'},
  {path: new RegExp('^/upload/?$'), method:'POST'},
  {path: new RegExp('^/image/?$'), method:'GET'},
  {path: new RegExp('^/image/\\w+.png/?$'), method:'GET'}
];

/**
 * Route filter rule. Checks if route is valid for our site.
 * If route is invalid (matches nothing in allowedUrls array) responds with 404.
 */
function checkForAllowed(req, res, next) {
  var requestedUrl = url.parse(req.url).pathname;
  allowedUrls.forEach(function(info) {
    if (info.path.test(requestedUrl) && (info.method===req.method)) {
      console.log('match: ', requestedUrl, info.path);
      next() ;
      return ;
    }
  });

  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write("Page not found: " + req.url);
  res.end();
}

/**
 * Generates main page
 */
function mainPage(req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("This is main page");
  res.end();
}

/**
 * Generates '/upload' page; processes both POST and GET requests.
 */
function uploadPage(req, res) {
  var message = '';
  if (req.method === 'POST') {
    message = "Sorry, we can't handle uploads right now" ;
  }
  else if (req.method === 'GET') {
    message = 'Sorry, this page is not ready yet';
  }

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(message);
  res.end();
}

/**
 * Generates '/image' and '/image/<some name>.png'.
 * Note, this function is not ready for now, so you should not perform this
 * requests.
 */
function imagePage(req, res) {
  var requestedUrl = url.parse(req.url).pathname;
  if (requestedUrl === '/') {
    //generate page for all uploaded images
  }
  else {
    //generate page for one of requested images
  }
}


//============================================================================
// now we can create app and setup routes
var app = connect() ;

//first, check if url is allowed for this site
app.use('/', checkForAllowed) ;
//then route that url to its processor
app.use('/upload', uploadPage);
app.use('/image', imagePage);
app.use('/', mainPage);

//finally,
app.listen(8080);


