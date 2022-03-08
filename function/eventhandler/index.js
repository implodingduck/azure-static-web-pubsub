const { WebPubSubServiceClient } = require("@azure/web-pubsub");

module.exports = async function (context, req) {
    context.log('Lets try handling some sort of event!')
    
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
    
    const eventName = req.headers['ce-eventname']
    context.log(`The event is: ${eventName} with body: ${req.body}`)

    const userId = req.headers['ce-userid']
    const eventTime = req.headers['ce-time']
    if (eventName === 'message'){
        serviceClient.sendToAll({ message: req.body, time: eventTime, user: userId });
    }
    
    
    context.res = { status: 200 }

}