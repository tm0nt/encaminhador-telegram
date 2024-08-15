const cleanText = (text) => {
    return text ? text.replace(/@\w+/g, '') : ''; // Remove @username
  };
  
  const handleMessage = async (bot, msg, groupCapture, groupSender) => {
    try {
      const chatId = msg.chat.id;
  
      if (chatId.toString() === groupCapture) {
        const { caption, photo, video, media_group_id } = msg;
  
        // Verifica se é uma foto agrupada
        if (photo && media_group_id) {
          const mediaGroup = [];
          for (const photoItem of msg.media_group) {
            const fileId = photoItem.file_id;
            mediaGroup.push({
              type: 'photo',
              media: fileId,
              caption: cleanText(caption),
            });
          }
          await bot.sendMediaGroup(groupSender, mediaGroup);
        } else if (photo) {
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
  