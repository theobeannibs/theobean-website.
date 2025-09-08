const { Blobs } = require('@netlify/blobs');

exports.handler = async (event) => {
  // We only accept POST requests
  if (event.httpMethod !== 'POST' ) {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }
  try {
    // Parse the incoming data from the form
    const { name, phone, province } = JSON.parse(event.body);

    // Make sure all fields are present
    if (!name || !phone || !province) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'All fields are required.' }) 
      };
    }

    // Connect to the Netlify Blobs store
    const blobs = new Blobs({
        authentication: { token: process.env.NETLIFY_API_TOKEN },
        siteID: process.env.SITE_ID
    });
    const store = blobs.getStore('farmers-registry');

    // Create a unique ID for the farmer entry
    const entryId = `${phone}-${Date.now()}`;
    
    // Save the data as a JSON object
    await store.setJSON(entryId, { 
      name, 
      phone, 
      province, 
      submittedAt: new Date().toISOString() 
    });

    // Send a success response back to the form
    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: 'Registration successful!' }) 
    };

  } catch (error) {
    // If anything goes wrong, log the error and send a server error response
    console.error('Registration Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Could not process registration.' }) 
    };
  }
};
