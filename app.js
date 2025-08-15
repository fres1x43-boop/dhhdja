const tg = window.Telegram.WebApp;

// Инициализация
tg.expand();
document.getElementById('username').textContent = tg.initDataUnsafe.user.first_name;
document.getElementById('userid').textContent = `ID: ${tg.initDataUnsafe.user.id}`;
if (tg.initDataUnsafe.user.photo_url) {
    document.getElementById('avatar').src = tg.initDataUnsafe.user.photo_url;
}

// Обработчик кнопки
document.getElementById('topupBtn').addEventListener('click', () => {
    tg.openInvoice({
        title: "Пополнение звезд",
        description: "20 звезд для вашего аккаунта",
        currency: "XTR",
        prices: [{ label: "20 Stars", amount: 20 }],
        payload: `stars_${tg.initDataUnsafe.user.id}_${Date.now()}`,
    }, (status) => {
        if (status === 'paid') {
            tg.showAlert("✅ Успешно! 20 звезд добавлены");
            // Здесь можно отправить запрос на ваш сервер для подтверждения
        } else if (status === 'failed') {
            tg.showAlert("⚠️ Платеж не прошел");
        }
    });
});
