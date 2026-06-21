export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = 'https://script.google.com/macros/s/AKfycbzHhHdi6CISvgvXROpnWwogvHXeE73ZQWLlOEN3o55qJMZrt-VbYYAj_6XVNUDE2e0_/exec';
      const body = JSON.stringify(req.body);

      const response = await fetch(GAS_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });

      console.log('final status:', response.status);

      const text = await response.text();
      console.log('GAS response:', text.slice(0, 300));

      res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('webhook error:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(200).send('OK');
  }
}
