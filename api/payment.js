export default async function handler(req, res) {
  if (req.method === 'POST') {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const { user_id } = req.body;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user_id,
          title: "Пополнение звезд",
          description: "20 звезд для вашего аккаунта",
          payload: `stars_${user_id}_${Date.now()}`,
          currency: "XTR",
          prices: [{ label: "20 Stars", amount: 20 }],
          provider_token: "TEST"
        })
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Payment failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
