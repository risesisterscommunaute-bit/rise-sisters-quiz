const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, prenom, archetype } = JSON.parse(event.body);

  const archetypeLists = {
    'La Guerrière': 6,
    'La Performeuse': 7,
    "L'Architecte": 8,
    'La Visionnaire': 9,
    'La Créatrice': 10
  };

  const listId = archetypeLists[archetype] || 3;

  const payload = JSON.stringify({
    email: email,
    attributes: {
      PRENOM: prenom,
      ARCHETYPE: archetype
    },
    listIds: [3, listId],
    updateEnabled: true
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/contacts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ success: true })
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });

    req.write(payload);
    req.end();
  });
};
