const tg = window.Telegram.WebApp;

// Инициализация приложения
function initApp() {
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Отображаем данные пользователя
    const user = tg.initDataUnsafe.user;
    if (user) {
        document.getElementById('username').textContent = 
            [user.first_name, user.last_name].filter(Boolean).join(' ');
        document.getElementById('userid').textContent = `ID: ${user.id}`;
        if (user.photo_url) {
            document.getElementById('avatar').src = user.photo_url;
        }
    }
    
    // Обработчик кнопки
    document.getElementById('topupBtn').addEventListener('click', () => {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const invoice = {
            title: "Пополнение звезд",
            description: "20 звезд для вашего аккаунта",
            currency: "XTR",
            prices: [{ label: "20 Stars", amount: 20 }],
            payload: `stars_${user.id}_${Date.now()}`,
            provider_token: "TEST"
        };
        
        tg.openInvoice(invoice, (status) => {
            if (status === 'paid') {
                tg.showAlert("✅ Платеж успешен! Звезды будут зачислены в течение 1 минуты");
                // Можно добавить автоматическое обновление баланса
            } else if (status === 'failed') {
                tg.showAlert("⚠️ Платеж не прошел. Попробуйте еще раз");
            }
        });
    });
}

// Запускаем приложение
document.addEventListener('DOMContentLoaded', initApp);
