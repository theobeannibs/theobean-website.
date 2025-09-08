const { Blobs } = require('@netlify/blobs');
const fetch = require('node-fetch');
const responses = require('../../src/responses.json');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' ) {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const maytapiApiKey = process.env.MAYTAPI_API_KEY;
  if (!maytapiApiKey) {
    console.error('MAYTAPI_API_KEY is not set.');
    return { statusCode: 500, body: 'Server configuration error.' };
  }

  try {
    const payload = JSON.parse(event.body);
    const { message, user, conversation } = payload;

    if (payload.event === 'message' && message && message.type === 'text') {
      const userPhone = user.phone;
      const userMessage = message.text.toLowerCase().trim();
      
      const blobs = new Blobs({
        authentication: {
            token: process.env.NETLIFY_API_TOKEN
        },
        siteID: process.env.SITE_ID
      });
      const sessionStore = blobs.getStore('whatsapp-sessions');
      let session = await sessionStore.get(userPhone, { type: 'json' }) || { state: 'GREETING' };

      let replyText;

      switch (session.state) {
        case 'GREETING':
          if (userMessage === 'register') {
            session.state = 'AWAITING_NAME';
            replyText = responses.awaitingName;
          } else {
            replyText = responses.greeting;
          }
          break;
        
        case 'AWAITING_NAME':
          session.name = message.text;
          session.state = 'AWAITING_FARM_SIZE';
          replyText = responses.awaitingFarmSize;
          break;

        case 'AWAITING_FARM_SIZE':
          session.farmSize = message.text;
          session.state = 'AWAITING_LOCATION';
          replyText = responses.awaitingLocation;
          break;

        case 'AWAITING_LOCATION':
          session.location = message.text;
          session.state = 'CONFIRMATION';
          replyText = `Thank you! Please confirm your details:\n\nName: ${session.name}\nFarm Size: ${session.farmSize}\nLocation: ${session.location}\n\nReply "yes" to confirm or "no" to start over.`;
          break;

        case 'CONFIRMATION':
          if (userMessage === 'yes') {
            const farmersStore = blobs.getStore('farmers');
            const farmerId = `farmer-${userPhone}-${Date.now()}`;
            await farmersStore.setJSON(farmerId, {
              name: session.name,
              phone: userPhone,
              farmSize: session.farmSize,
              location: session.location,
              registeredAt: new Date().toISOString(),
              status: 'pending_review_whatsapp'
            });
            replyText = responses.confirmationSuccess;
            session = { state: 'GREETING' }; // Reset session
          } else {
            session = { state: 'GREETING' };
            replyText = responses.confirmationFail;
          }
          break;

        default:
          replyText = responses.greeting;
          session = { state: 'GREETING' };
      }

      await sessionStore.setJSON(userPhone, session);
      await sendWhatsappMessage(userPhone, replyText, maytapiApiKey);
    }

    return { statusCode: 200, body: 'OK' };

  } catch (error) {
    console.error('Error in WhatsApp bot:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

async function sendWhatsappMessage(phone, text, apiKey) {
  const MAYTAPI_PRODUCT_ID = process.env.MAYTAPI_PRODUCT_ID;
  const MAYTAPI_PHONE_ID = process.env.MAYTAPI_PHONE_ID;

  const url = `https://api.maytapi.com/api/${MAYTAPI_PRODUCT_ID}/${MAYTAPI_PHONE_ID}/sendMessage`;

  const body = {
    to_number: phone,
    type: 'text',
    message: text,
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-maytapi-key': apiKey,
      },
      body: JSON.stringify(body ),
    });
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}
