const { Blobs } = require('@netlify/blobs');

exports.handler = async (event) => {
  // We only accept POST requests
  if (event.httpMethod !== 'POST' ) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, phone, "farm-size": farmSize, location } = JSON.parse(event.body);

    // Basic validation
    if (!name || !phone || !farmSize || !location) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields.' }),
      };
    }

    const blobs = new Blobs({
        authentication: {
            token: process.env.NETLIFY_API_TOKEN
        },
        siteID: process.env.SITE_ID
    });
    const farmersStore = blobs.getStore('farmers');

    const farmerId = `farmer-${phone}-${Date.now()}`;
    
    await farmersStore.setJSON(farmerId, {
      name,
      phone,
      farmSize,
      location,
      registeredAt: new Date().toISOString(),
      status: 'pending_review'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registration successful!' }),
    };

  } catch (error) {
    console.error('Error processing registration:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error. Could not process registration.' }),
    };
  }
};
