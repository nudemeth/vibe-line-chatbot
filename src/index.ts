import express from 'express';
import { middleware, Client, ClientConfig, WebhookEvent, MessageEvent, TextMessage } from '@line/bot-sdk';


// Define configuration for LINE Messaging API
const channelAccessToken: string = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const channelSecret: string = process.env.LINE_CHANNEL_SECRET || '';

const config = {
  channelAccessToken: channelAccessToken,
  channelSecret: channelSecret,
};

// Create a new LINE SDK client
const client: Client = new Client(config as ClientConfig);

// Create a new middleware
const lineMiddleware: express.RequestHandler = middleware(config);

const app = express();

// Apply the middleware
app.use('/webhook', lineMiddleware);

// Register a webhook handler for the /webhook endpoint
app.post('/webhook', async (req: express.Request, res: express.Response) => {
  try {
    const events: WebhookEvent[] = req.body.events;
    // Process each event
    await Promise.all(events.map(async (event: WebhookEvent) => {
      handleEvent(event);
    }));
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// Event handler function
function handleEvent(event: WebhookEvent): Promise<any> {
  // Handle only message events
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text: string = (event.message as TextMessage).text;
  // Create a replying text message
  const replyText: string = `Echo: ${text}`;
  const replyMessage: TextMessage = { type: 'text', text: replyText };

  // Reply to the user
  return client.replyMessage(event.replyToken, replyMessage);
}

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const port = parseInt(process.env.PORT || '8080'); // Change default port to 8080 as required by LINE
app.listen(port, () => {
  console.log(`LINE bot is listening on port ${port}`);
});
