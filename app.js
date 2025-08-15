const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById('topupBtn').addEventListener('click', async () => {
    try {
        // 1. Инициализируем платеж
        const response = await fetch('http://localhost:5000/init-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: tg.initDataUnsafe.user.id })
        });
        
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error('Payment init failed');
        }

        // 2. Открываем инвойс
        tg.openInvoice(data.invoice_payload, async (status) => {
            if (status === 'paid') {
                // 3. Подтверждаем платеж
                const confirm = await fetch('http://localhost:5000/confirm-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: tg.initDataUnsafe.user.id })
                });
                
                const result = await confirm.json();
                
                if (result.status === 'success') {
                    document.getElementById('balance').textContent = 
                        `${result.new_balance} stars`;
                    tg.showAlert(`✅ Получено 20 звезд! Новый баланс: ${result.new_balance}`);
                }
            }
        });
    } catch (error) {
        console.error('Payment error:', error);
        tg.showAlert('Ошибка при оплате: ' + error.message);
    }
});

// Инициализация
tg.ready();
