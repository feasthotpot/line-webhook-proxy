export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = process.env.GAS_URL;
      const body = JSON.stringify(req.body);
      
      await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-line-signature': req.headers['x-line-signature'] || ''
        },
        body: body,
        redirect: 'follow'
      });
      
      res.status(200).json({ status: 'ok' });
    } catch (err) {
      res.status(200).json({ status: 'ok' });
    }
  } else {
    res.status(200).json({ status: 'ok' });
  }
}
