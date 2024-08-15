const cleanText = (text) => {
    return text ? text.replace(/@\w+/g, '') : ''; // Remove @username
  };
  
  const handleMessage = async (bot, msg, groupCapture, groupSender) => {
    try {
      const chatId = msg.chat.id;
      console.log(msg)
      if (chatId.toString() === groupCapture) {
        const { caption, photo, video } = msg;
  
        if (photo) {
          const fileId = photo[photo.length - 1].file_id; 
          await bot.sendPhoto(groupSender, fileId, { caption: cleanText(caption) });
        } else if (video) {
          await bot.sendVideo(groupSender, video.file_id, { caption: cleanText(caption) });
        }
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };
  
  module.exports = { handleMessage };