export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = process.env.GAS_URL;
      const body = JSON.stringify(req.body);
      const encoded = Buffer.from(body).toString('base64');
      const url = GAS_URL + '?b64=' + encodeURIComponent(encoded);
      
      // 手動跟隨所有導向
      let currentUrl = url;
      for (let i = 0; i < 5; i++) {
        const response = await fetch(currentUrl, {
          method: 'GET',
          redirect: 'manual',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        console.log('step', i, 'status:', response.status, 'url:', currentUrl);
        if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
          currentUrl = response.headers.get('location');
          console.log('redirect to:', currentUrl);
        } else {
          console.log('final status:', response.status);
          break;
        }
      }
    } catch (err) {
      console.log('error:', err.message);
    }
  }
  res.status(200).json({ status: 'ok' });
}
