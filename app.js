// Проверяем, что открыто в Telegram
if (!window.Telegram?.WebApp?.initData) {
    document.body.innerHTML = '<h1>Откройте приложение в Telegram</h1>';
    throw new Error("Not in Telegram");
}

const tg = window.Telegram.WebApp;
tg.expand();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
document.getElementById('avatar').src = user?.photo_url || '';
document.getElementById('username').textContent = 
    [user?.first_name, user?.last_name].filter(Boolean).join(' ');
document.getElementById('userid').textContent = `ID: ${user?.id || 'N/A'}`;

// Кнопка пополнения
document.getElementById('topupBtn').addEventListener('click', async () => {
    const amount = 20; // Звёзд за 1 пополнение
    
    // Отправляем запрос на создание платежа
    const response = await fetch('http://your-server:5000/payment-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            amount: amount
        })
    });

    const result = await response.json();
    if (result.status !== 'success') {
        tg.showAlert('Ошибка при создании платежа');
        return;
    }

    // Открываем инвойс
    tg.openInvoice(result.invoice.result.payload, (status) => {
        if (status === 'paid') {
            // Обновляем баланс
            fetch('http://your-server:5000/update-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    amount: amount
                })
            }).then(() => {
                tg.showAlert(`✅ Получено ${amount} звёзд!`);
                updateBalanceDisplay();
            });
        }
    });
});

// Показываем текущий баланс
async function updateBalanceDisplay() {
    const response = await fetch(`http://your-server:5000/get-balance?user_id=${user.id}`);
    const data = await response.json();
    document.getElementById('balance').textContent = `${data.balance} звёзд`;
}

// Инициализация
updateBalanceDisplay();
