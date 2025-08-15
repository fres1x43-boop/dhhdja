const tg = window.Telegram.WebApp;

async function initApp() {
  tg.expand();
  tg.enableClosingConfirmation();

  // Показываем данные пользователя
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
  document.getElementById('topupBtn').addEventListener('click', async () => {
    try {
      if (!user?.id) {
        tg.showAlert("⚠️ Не удалось идентифицировать пользователя");
        return;
      }

      // 1. Создаем инвойс через серверную функцию
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await response.json();

      // 2. Открываем платежное окно
      if (data.ok) {
        tg.openInvoice(data.result, status => {
          if (status === 'paid') {
            tg.showAlert("✅ Платеж успешен! Звезды зачислены");
          } else if (status === 'failed') {
            tg.showAlert("⚠️ Платеж не прошел");
          }
        });
      } else {
        tg.showAlert("⚠️ Ошибка при создании платежа");
      }
    } catch (error) {
      console.error('Payment error:', error);
      tg.showAlert("⚠️ Произошла ошибка");
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
