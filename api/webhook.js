export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = process.env.GAS_URL;
      const body = JSON.stringify(req.body);
      const url = GAS_URL + '?body=' + encodeURIComponent(body);
      
      await fetch(url, { method: 'GET' });
      
      res.status(200).json({ status: 'ok' });
    } catch (err) {
      res.status(200).json({ status: 'ok' });
    }
  } else {
    res.status(200).json({ status: 'ok' });
  }
}
