const cleanText = (text) => {
    return text ? text.replace(/@\w+/g, '') : ''; // Remove @username
  };
  
  const handleMessage = async (bot, msg, groupCapture, groupSender, mediaGroupBuffer) => {
    try {
      const chatId = msg.chat.id;
  
      if (chatId.toString() === groupCapture) {
        const { caption, photo, video, media_group_id } = msg;
  
        // Se a mensagem fizer parte de um grupo de mídia, adicione à buffer
        if (media_group_id) {
          if (!mediaGroupBuffer[media_group_id]) {
            mediaGroupBuffer[media_group_id] = [];
          }
  
          if (photo) {
            mediaGroupBuffer[media_group_id].push({
              type: 'photo',
              media: photo[photo.length - 1].file_id,
              caption: cleanText(caption),
            });
          } else if (video) {
            mediaGroupBuffer[media_group_id].push({
              type: 'video',
              media: video.file_id,
              caption: cleanText(caption),
            });
          }
  
          // Verifica se todas as mídias do grupo foram recebidas
          if (mediaGroupBuffer[media_group_id].length >= photo.length) {
            await bot.sendMediaGroup(groupSender, mediaGroupBuffer[media_group_id]);
            delete mediaGroupBuffer[media_group_id]; // Limpa o buffer
          }
        } else {
          // Mensagem fora de grupo de mídia
          if (photo) {
            const fileId = photo[photo.length - 1].file_id;
            await bot.sendPhoto(groupSender, fileId, { caption: cleanText(caption) });
          } else if (video) {
            await bot.sendVideo(groupSender, video.file_id, { caption: cleanText(caption) });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };
  
  module.exports = { handleMessage };
  