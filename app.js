const tg = window.Telegram.WebApp;

function log(message) {
    console.log(message);
    // Можно также отправлять логи на сервер
    // fetch('https://your-server.com/log', { method: 'POST', body: message })
}

function initApp() {
    try {
        log("Initializing Mini App...");
        tg.expand();
        tg.enableClosingConfirmation();
        log("WebApp initialized");

        const user = tg.initDataUnsafe.user;
        if (user) {
            log(`User detected: ${user.id}`);
            document.getElementById('username').textContent = 
                [user.first_name, user.last_name].filter(Boolean).join(' ');
            document.getElementById('userid').textContent = `ID: ${user.id}`;
            if (user.photo_url) {
                document.getElementById('avatar').src = user.photo_url;
            }
        } else {
            log("No user data available");
        }

        document.getElementById('topupBtn').addEventListener('click', () => {
            log("Top Up button clicked");
            handlePayment();
        });
    } catch (e) {
        log(`Initialization error: ${e}`);
    }
}

function handlePayment() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) {
            log("Payment failed: no user data");
            tg.showAlert("⚠️ Не удалось идентифицировать пользователя");
            return;
        }

        log(`Attempting payment for user ${user.id}`);
        
        const invoice = {
            title: "Пополнение звезд",
            description: "20 звезд для вашего аккаунта",
            currency: "XTR",
            prices: [{ label: "20 Stars", amount: 20 }],
            payload: `stars_${user.id}_${Date.now()}`,
            provider_token: "TEST"
        };

        log(`Invoice data: ${JSON.stringify(invoice)}`);
        
        tg.openInvoice(invoice, (status) => {
            log(`Payment status: ${status}`);
            
            if (status === 'paid') {
                tg.showAlert("✅ Платеж успешен! Звезды будут зачислены");
                updateBalance();
            } else if (status === 'failed') {
                tg.showAlert("⚠️ Платеж не прошел. Попробуйте еще раз");
            }
        });
    } catch (e) {
        log(`Payment error: ${e}`);
        tg.showAlert("⚠️ Ошибка при создании платежа");
    }
}

function updateBalance() {
    log("Updating balance...");
    // Здесь можно добавить запрос к серверу для обновления баланса
}

document.addEventListener('DOMContentLoaded', initApp);
