const tg = window.Telegram.WebApp;
tg.expand();

// Элементы интерфейса
const payButton = document.getElementById('topupBtn');
const balanceDisplay = document.getElementById('balance');

// Обработчик платежа
payButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:5000/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: tg.initDataUnsafe.user.id })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            tg.openInvoice(data.payload, async (status) => {
                if (status === 'paid') {
                    const update = await fetch('http://localhost:5000/confirm-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            user_id: tg.initDataUnsafe.user.id 
                        })
                    });
                    
                    const result = await update.json();
                    if (result.status === 'success') {
                        balanceDisplay.textContent = `${result.new_balance} звёзд`;
                        tg.showAlert(`✅ Успешно! Новый баланс: ${result.new_balance} звёзд`);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Payment error:', error);
        tg.showAlert('⚠️ Ошибка платежа');
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const user = tg.initDataUnsafe.user;
    document.getElementById('username').textContent = user.first_name;
    document.getElementById('userid').textContent = `ID: ${user.id}`;
    if (user.photo_url) {
        document.getElementById('avatar').src = user.photo_url;
    }
});
