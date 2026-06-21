export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const GAS_URL = 'https://script.google.com/macros/s/AKfycbwKPq_qpuIngaqr1rLfyLrF_feUleUayvtQnSCBIQ7SiNHuDtLL2kIuaU4fYaVJF-E/exec';
      const body = JSON.stringify(req.body);

      // 手動跟隨所有導向
      let currentUrl = GAS_URL;
      let response;

      for (let i = 0; i < 5; i++) {
        response = await fetch(currentUrl, {
          method: 'POST',
          redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          },
          body: body
        });

        console.log('step', i, 'status:', response.status, 'url:', currentUrl);

        if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
          currentUrl = response.headers.get('location');
          console.log('redirect to:', currentUrl);
          // 跟隨 307/308 時需要保留原本的 method 和 body，所以不需要改動
        } else {
          console.log('final status:', response.status);
          break;
        }
      }

      const text = await response.text();
      console.log('GAS response:', text);

      res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('webhook error:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(200).send('OK');
  }
}
