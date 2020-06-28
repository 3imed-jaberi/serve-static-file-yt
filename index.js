// _________ About _________ //
console.info(
  '\x1b[36m%s\x1b[0m',
  `
    Serve static files through Raw Node.js 🚀 ..
            Made with ❤️  by Imed Jaberi
           <https://www.3imed-jaberi.com>       
  `
);

// __________ Pure Node.js Modules __________ //
const fs = require('fs');
const path = require('path');
const http = require('http');

// __________ Constant __________ //
const dir = path.join(__dirname, 'public');
const mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript',
  json: 'application/json'
};

// __________ Server Handler __________ //
const serverHandler = function (req, res) {
  // Support only GET request ..
  if (req.method !== 'GET') {
    res.statusCode = 501;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(
      'Method Not Implemented <Expected to use the GET method for serve static files>'
    );
  }

  // Get the file path .. 
  const file = path.join(dir, `${req.url}`.slice(1));

  // Check if the file exit or not in the dir ..
  if (file.indexOf(`${dir}${path.sep}`) !== 0) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Forbidden');
  }
  
  // Extract the right Content-Type .. 
  const type = mime[path.extname(file).slice(1)] || 'text/plain';

  // Read the file (stream) ..
  const stream = fs.createReadStream(file);

  // Handle the response over the stream ..
  stream
    .on('open', () => {
      res.setHeader('Content-Type', type);
      stream.pipe(res);
    })
    .on('error', () => {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not Found !');
    });
}

// __________ Server __________ //
const PORT = process.env.PORT || 5000;
const server = http.createServer(serverHandler);

// __________ Run __________ //
server.listen(PORT, () => console.log(`Server Listening on PORT ${PORT} 🚀 ..`));