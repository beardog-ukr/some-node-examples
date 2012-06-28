var connect = require('connect');
var url = require('url');
var path = require('path') ;
var fs = require('fs');

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

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write('/image page is not ready for now');
  res.end();
}


//============================================================================
// now we can create app and setup routes
var app = connect() ;

// this variable defines logging style. Just for easy switching between examples
var loggingMode = 'stdout'; // try also 'file' or 'external'
switch(loggingMode) {
  // logging to stdout --------------------------------------------------------
  case 'stdout':
    /**
     *  Processes requests and returns shortened version of the user agent.
     *  Not for real use, it just shows how we can create custom logger tokens.
     */
    function shortUserAgentToken(req, res){
      var ua = req.headers['user-agent'] ;
      if (ua.search('Firefox')>-1) {
        return 'FF' ;
      }
      else if (ua.search('Opera')>-1) {
        return "Opera" ;
      }

      // if there was no matches
      return "strange browser" ;
    }

    // commented lines are also valid;
    //connect.logger.format('uag', ':url user agent is ":user-agent"') ;
    //app.use('/image', connect.logger('uag')) ;
    //connect.logger.token('short-user-agent', shortUserAgentToken);
    app.use('/image', connect.logger(':url user agent is ":short-user-agent"')) ;
    app.use(connect.logger('short')) ;
    //---
    break;

  // logging to the file ------------------------------------------------------
  case 'file':
    var logStream = fs.createWriteStream( path.join(__dirname, 'log.txt'), {encoding:'utf8'}) ;
    var loggerOptions = { format:'tiny',
                          stream: logStream
                        }
    app.use(connect.logger(loggerOptions)) ;

    break;

  // logging with external logger ---------------------------------------------
  case 'external':
    var caterpillar = require('caterpillar');
    var logger = new caterpillar.Logger();
    logger.setLevel(6);
    function CaterpillarLogger() {
      this.write = function(str, enc) {
        logger.log('info', str);
      }
    }
    var loggerOptions = { format:'short',
                          stream: new CaterpillarLogger
                        }
    app.use(connect.logger(loggerOptions)) ;

    break;
}

//-----------------------------------------------------------------------------
//first, check if url is allowed for this site
app.use('/', checkForAllowed) ;
//then route that url to its processor
app.use('/upload', uploadPage);
app.use('/image', imagePage);
app.use('/', mainPage);

//finally,
app.listen(8080);


