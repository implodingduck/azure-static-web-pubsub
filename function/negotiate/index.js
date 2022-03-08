const { WebPubSubServiceClient } = require("@azure/web-pubsub");

module.exports = async function (context, req) {
    const serviceClient = new WebPubSubServiceClient(process.env.PUBSUBHUB_CONNECTIONSTR, process.env.PUBSUBHUB_NAME);

    // Get the access token for the WebSocket client connection to use
    let userId = req.query.userId
    let token = await serviceClient.getClientAccessToken(userId);

    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = { body: token };
};