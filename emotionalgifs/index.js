const multipart = require('parse-multipart');
const fetch = require('node-fetch');


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    
// here's your boundary:
const boundary = multipart.getBoundary(req.headers['content-type']);
  
// TODO: assign the body variable the correct value
const body = req.body;

// parse the body
const parts = multipart.Parse(body, boundary);

// let convertedResult = Buffer.from(parts[0].data).toString('base64');

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: convertedResult
    // };

    //module.exports function
//analyze the image
    const result = await analyzeImage(parts[0].data);
    context.res = {
        body: {
            result
        }
    };
    console.log(result)
    context.done(); 
}

async function analyzeImage(img){
    // const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    // const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    const subscriptionKey = '50cd864af0074326a37150ed20a9e431';
    const uriBase = 'https://saniasfaceapi.cognitiveservices.azure.com' + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'blur'     //FILL IN THIS LINE
    })

    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img,  //WHAT ARE WE SENDING TO THE API?
        headers: {
            'Content-Type': 'application/octet-stream',
            "Ocp-Apim-Subscription-Key": subscriptionKey
        }
    })
    let data = await resp.json();
    
    return data; 
}