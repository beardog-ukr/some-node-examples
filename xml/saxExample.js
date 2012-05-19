var fs = require('fs');
var path = require('path');
var libxml = require("libxmljs");

//var util = require('util');

// ============================================================================
var debugCallbacks = { startDocument: dcStartDocument
                     , endDocument: dcEndDocument
                     , startElementNS: dcStartElementNS
                     , endElementNS: dcEndElementNS
                     , characters: dcCharacters
                     , comment: dcComment
                     , warning: dcWarning
                     , error: dcError
                     , cdata: dcCdata
                     }

function dcStartDocument() {
      console.log('x> started parsing');
}

function dcEndDocument() {
  console.log('x> finished parsing');
}

/**
 * Processes starting element.
 *
 * @param {String} elem Tag of the element
 * @param {Array}  attrs Array of the attributes data; each element is also array of four values describing element
 * @param {String} prefix Namespace prefix (or null)
 * @param {String} uri Namespace uri (or null)
 * @param {Array} namespaces Array with data describing namespaces declared in this element.
 */
function dcStartElementNS(elem, attrs, prefix, uri, namespaces) {
  var els = elem;
  if (prefix) {
    els = prefix + ':' + elem + '(' + uri + ')';
  }
  console.log('x> element started: %s', els);

  var ar = ['x>                : no attributes'];
  if (attrs.length>0) {
    ar = [];

    attrs.forEach(function(attr) {
      // attr is an array of four values:
      var k = attr[0]; // key
      var p = attr[1]; // prefix (or null)
      var u = attr[2]; // url of the namespace (or null)
      var v = attr[3]; // value

      var as='';
      as += 'x>       attribute: ' ;
      if (p) {
        as += p + ':';
      }
      as += k + ' = ' + v ;
      if (u) {
        as += '(' + u + ')' ;
      }
      ar.push(as);
    });
  }
  console.log(ar.join('\n'));

  var nr = ['x>                : no namespaces'];
  if (namespaces.length>0) {
    nr = [];
    namespaces.forEach( function(ns) {
      var nss = 'x>        namepace: ' + ns[0] + ' for ' + ns[1]  ;
      nr.push(nss);
    });
  }
  console.log( nr.join('\n') );
}

function dcEndElementNS(elem, prefix, uri) {
  var els = elem;
  if (prefix) {
    els = prefix + ':' + elem + '(' + uri + ')';
  }
  console.log('x> element finished: %s', els);
}

/**
 *  Processes characters inside element.
 *  This one gets called every time something is found after '>' so it's good
 * idea to ignore srtings that contain only spaces and newlines
 * @param {String} chars The characters
 */
function dcCharacters(chars) {
  if (!chars.match(/^[\s\n\r]+$/)) {
    console.log('x> characters: %s', chars);
  }
}

function dcComment(comment) {
  console.log('x> comment: %s...', comment.substring(0,30));
}

function dcWarning(msg) {
  console.log('x> warning: %s', msg);
}

function dcError(msg) {
  console.log('x> error: %s', msg);
}

function dcCdata(cdata) {
  console.log('x> cdata: %s...', cdata.substring(0,30));
}

// ============================================================================
/**
 * Reads the xml file and asks parser to process it.
 */
function generate() {
  var tfx = path.normalize(__dirname + '/testData/bt01.xml') ;

  fs.readFile(tfx, 'utf8', function(err, data) {
    if (err) {
      console.log('failed to read %s', tfx) ;
      return;
    }

    var parser = new libxml['SaxParser'](debugCallbacks);
    parser.parseString(data);


    console.log('Finished'); // note, this will be printed after all oter output
  });
}

generate();


