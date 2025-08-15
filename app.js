const tg = window.Telegram.WebApp;

// Инициализация
tg.expand();
tg.ready();

// Обработчик кнопки
document.getElementById('topupBtn').addEventListener('click', () => {
    // Параметры платежа для Telegram Stars
    const invoice = {
        title: "Пополнение звезд",
        description: "20 звезд для вашего аккаунта",
        currency: "XTR",  // Валюта Telegram Stars
        prices: [{ label: "20 Stars", amount: 20 }],  // 20 звезд
        payload: `stars_${tg.initDataUnsafe.user.id}_${Date.now()}`,
        need_name: false,
        need_phone_number: false,
        need_email: false,
        need_shipping_address: false
    };

    // Открываем платежное окно
    tg.openInvoice(invoice, (status) => {
        if (status === 'paid') {
            tg.showAlert("✅ Платеж успешен! Звезды зачислены");
            // Здесь можно обновить баланс
        } else if (status === 'failed') {
            tg.showAlert("⚠️ Платеж не прошел");
        }
    });
});

// Показываем данные пользователя
if (tg.initDataUnsafe.user) {
    document.getElementById('username').textContent = 
        tg.initDataUnsafe.user.first_name + 
        (tg.initDataUnsafe.user.last_name ? ' ' + tg.initDataUnsafe.user.last_name : '');
    
    if (tg.initDataUnsafe.user.photo_url) {
        document.getElementById('avatar').src = tg.initDataUnsafe.user.photo_url;
    }
}
