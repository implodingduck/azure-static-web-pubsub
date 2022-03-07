const { WebPubSubServiceClient } = require("@azure/web-pubsub");

module.exports = async function (context, req) {
    context.log('Lets try handling some sort of event!')
    context.log(`So the context is ${req.context}`)
    // We have to handle webhook validation https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#validation
    if (req.method === 'GET') {
        context.log(`### Webhook validation was called for ${req.headers['webhook-request-origin']}`)
        context.res = {
            headers: {
                'webhook-allowed-origin': req.headers['webhook-request-origin'],
            },
            status: 200,
        }
        context.done()
        return
    }
    const serviceClient = new WebPubSubServiceClient(process.env.PUBSUBHUB_CONNECTIONSTR, process.env.PUBSUBHUB_NAME);
    serviceClient.sendToAll({ message: "Hello world!", context: req.context });
    const userId = req.headers['ce-userid']
    const eventName = req.headers['ce-eventname']
    context.res = { status: 200 }

}