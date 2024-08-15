const TelegramBot = require('node-telegram-bot-api');
const { getEnvVariable } = require('./database/database');
const { handleMessage } = require('./functions/messageHandler');
const { scheduleMessage } = require('./functions/scheduler');

(async () => {
  // Carrega variáveis de ambiente do banco de dados
  const token = await getEnvVariable('TELEGRAM_BOT_TOKEN');
  const groupCapture = await getEnvVariable('GRUPO_CAPTURA_CONTEUDO');
  const groupSender = await getEnvVariable('GRUPO_ENVIA_CONTEUDO');
  const hoursInterval = parseInt(await getEnvVariable('HOURS_INTERVAL'), 10);
  const scheduledMessage = await getEnvVariable('SCHEDULED_MESSAGE');

  // Instância do bot
  const bot = new TelegramBot(token, { polling: true });

  // Monitora mensagens recebidas
  bot.on('message', (msg) => handleMessage(bot, msg, groupCapture, groupSender));

  // Agenda a mensagem para ser enviada a cada x horas
  scheduleMessage(bot, groupSender, scheduledMessage, hoursInterval);

  console.log('Bot de mensagens rodando...');
})();
