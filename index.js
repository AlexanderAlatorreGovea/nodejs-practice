const fs = require('fs');
const http = require('http');

//url parameter parses in urls
const url = require('url');

//this will concatanate a unique string
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');



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
    //product.productName is how we grab the json object from dev-data/data.json


const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );

const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);

const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');


const dataObj = JSON.parse(data);

//this makes the data json add the id to the end of the string
const slugs = dataObj.map(el => slugify(el.productName))

//READS THE TEMPLATE OVEVIEW

const server = http.createServer((req, res) => {
    const { query, pathname } = (url.parse(req.url, true));

    //OVERVIEW PAGE
        //this will render the html template above
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        res.end(output);

    //PRODUCT PAGE
    } else if (pathname === "/product") {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    //API PAGE
    } else if (pathname === '/api') {
        ///this will read the file and send back the data
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            //const productData = JSON.parse(data);
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
        });


    //NOT FOUND
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
