let pendingBody = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = process.env.GAS_URL;
      const body = JSON.stringify(req.body);
      
      // 用較短的方式傳遞
      const encoded = Buffer.from(body).toString('base64');
      const url = GAS_URL + '?b64=' + encodeURIComponent(encoded);
      
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      console.log('status:', response.status);
      console.log('url:', response.url);
      
    } catch (err) {
      console.log('error:', err.message);
    }
  }
  res.status(200).json({ status: 'ok' });
}
