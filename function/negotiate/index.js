module.exports = async function (context, req, connection) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = { body: connection };
};