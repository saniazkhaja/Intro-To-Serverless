const querystring = require('qs');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);

    const url = queryObject.MediaUrl0;
    context.log(url);
    context.res = {
        body: url
    };
}