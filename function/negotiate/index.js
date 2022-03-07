const { WebPubSubServiceClient } = require("@azure/web-pubsub");

module.exports = async function (context, req) {
    const serviceClient = new WebPubSubServiceClient("<ConnectionString>", "<hubName>");

    // Get the access token for the WebSocket client connection to use
    let token = await serviceClient.getClientAccessToken();

    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = { body: token };
};