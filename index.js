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
    //product.productName is how we grab the json object from dev-data/data.json
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

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

//READS THE TEMPLATE OVEVIEW

const server = http.createServer((req, res) => {
    const pathname = req.url;

    //OVERVIEW PAGE
        //this will render the html template above
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        res.end(output);

    //PRODUCT PAGE
    } else if (pathname === '/product') {
        res.end('this is the product')


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
