const { Blobs } = require('@netlify/blobs');

exports.handler = async (event) => {
  // Rule 1: Only accept POST requests
  if (event.httpMethod !== 'POST' ) {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    // Rule 2: Ensure the request body is valid JSON
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Bad request: Invalid JSON format.' }) };
    }
    
    const { name, phone, province } = data;

    // Rule 3: Validate that all required fields are present and not empty
    if (!name || !phone || !province) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'All fields are required. Please fill out the entire form.' }) 
      };
    }

    // Rule 4: Connect to the Netlify Blobs store
    // This requires NETLIFY_API_TOKEN and SITE_ID to be set in your Netlify environment variables
    const blobs = new Blobs({
        authentication: { token: process.env.NETLIFY_API_TOKEN },
        siteID: process.env.SITE_ID
    });
    const store = blobs.getStore('farmers-registry');

    // Rule 5: Create a unique ID and save the data
    const entryId = `${phone}-${Date.now()}`;
    await store.setJSON(entryId, { 
      name, 
      phone, 
      province, 
      submittedAt: new Date().toISOString() 
    });

    // Rule 6: Send a clear success response
    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: 'Registration successful!' }) 
    };

  } catch (error) {
    // Rule 7: Catch any other errors and provide a generic server error message
    console.error('Registration Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'An internal error occurred. Could not process registration.' }) 
    };
  }
};

