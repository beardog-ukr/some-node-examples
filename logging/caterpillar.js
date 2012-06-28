/**
 * Example for awesome 'caterpillar' console logger
 * https://github.com/bevry/caterpillar
 */
var caterpillar = require('caterpillar');

var logger = new caterpillar.Logger();

// level 7 is the debug level, which will output the debug line
// set it to level 6 or higher, to hide debug messages and ignore the debug line
logger.setLevel(6);

// this lists all possible levels of logging
for (var clName in logger.config.levels) {
  var clCode = logger.config.levels[clName];
  logger.log(clName, "this is ", clName, " and is level ", clCode);
}

logger.log('');

// this also lists all possible levels
logger.setLevel(6); // try to use another number here :)
logger.log('emergency', 'red critical message (level 0)');
logger.log('alert', 'this message is also red (level 1)');
logger.log('critical', 'one more red message (level 2)');
logger.log('error', 'still red (level 3)');
logger.log('warning', 'yellow warning (level 4)');
logger.log('notice', 'one more yellow (level 5)');
//you'll not see next line if log level is 5 or less
logger.log('info', 'Nice green message (level 6)');

logger.log('');

// color console messages
var cliColor = caterpillar.cliColor ;
logger.log('Roses are', cliColor.red('red') );
logger.log('Violets are', cliColor.blue('blue'));
logger.log(cliColor.underline.bold('You'), 'chase me &');
logger.log('I\'ll', cliColor.italic('catch'), 'you...');