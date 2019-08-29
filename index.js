const fs = require('fs');
const http = require('http');

//url parameter parses in urls
const url = require('url');

///////////////////////////////////
///FILES


///__dirname is where the pat is at or the ./ notation to specify the path
//file reading in the synchrounus version 
    //path to the file
    //this is reading the file ./txt/input.txt
    //the content will be the text = The avocado 🥑 is popular in vegetarian cuisine as a substitute for meats in sandwiches and salads because of its high fat content 😄
const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textInput);

const textOut = `this is what we know about the avo ${textInput}./ created on ${Date.now()}`;

///this is to write something inside of a file
    //second variable is what is going to be written in the file that this creates
fs.writeFileSync('./txt/output.txt', textOut);




/////////////////////////////////////
///SERVER
    //send back a response to a client
    //this will send out a response as requested

//top level code is only executed once it starts the program

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathname = req.url;

    if (pathname === '/' || pathname === '/overview') {
        res.end('this is the overview')
    } else if (pathname === '/product') {
        res.end('this is the product')
    } else if (pathname === '/api') {
        ///this will read the file and send back the data
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            //const productData = JSON.parse(data);
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>')
    }
});

//LISTEN TO INCOMING REQUESTS FROM THE CLIENT

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
});
