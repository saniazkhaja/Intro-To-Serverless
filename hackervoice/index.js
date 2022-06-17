module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // param name is password
    var password = req.query.password;
    context.log(password);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: password
    };

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };
}