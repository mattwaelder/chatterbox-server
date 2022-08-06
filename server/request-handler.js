/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

// {message: 'I am a message'}
var messages = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;


  // The outgoing status. !!!!!!!!!!!!!!
  // var statusCode = 200;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // Do some basic logging.

  if (request.method === 'GET') {
    //if endpoint is valid
    if (request.url === '/classes/messages') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(messages));
    //if endpoint is NOT valid
    } else {
      response.writeHead(404, headers);
      response.end(JSON.stringify([{error: 'messages not found'}]));
    }
  }

  if (request.method === 'POST') {
    //if endpoint is valid

    if (request.url === '/classes/messages') {
      response.writeHead(201, headers);
      //add data to messages
      //body ~ temp response
      let body = '';
      //event listener for data (chunk is post content)
      request.on('data', (chunk) => {
        body += chunk;
      }).on('end', ()=> {
        messages.push(JSON.parse(body));
        response.end(JSON.stringify(messages));
      });


    //if endpoint is NOT valid
    } else {
      response.writeHead(404, headers);
      response.end(JSON.stringify([{error: 'path not found'}]));
    }
  }


  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end(JSON.stringify({message: 'WHY WOULD YOU DO THIS TO ME'}));
  }
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

module.exports.requestHandler = requestHandler;