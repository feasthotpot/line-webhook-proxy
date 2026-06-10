export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = process.env.GAS_URL;
      const body = JSON.stringify(req.body);
      const url = GAS_URL + '?body=' + encodeURIComponent(body);
      
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      console.log('GAS response status:', response.status);
      console.log('GAS response url:', response.url);
      
    } catch (err) {
      console.log('fetch error:', err.message);
    }
  }
  res.status(200).json({ status: 'ok' });
}
