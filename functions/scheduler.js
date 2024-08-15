const schedule = require('node-schedule');

const scheduleMessage = (bot, groupSender, message, hoursInterval) => {
  schedule.scheduleJob(`0 */${hoursInterval} * * *`, async () => {
    try {
      console.log('Enviando mensagem programada...');
      await bot.sendMessage(groupSender, message);
      console.log('Mensagem programada enviada.');
    } catch (error) {
      console.error('Erro ao enviar mensagem programada:', error);
    }
  });
};

module.exports = { scheduleMessage };
