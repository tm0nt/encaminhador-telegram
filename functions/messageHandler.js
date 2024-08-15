const cleanText = (text) => {
    return text ? text.replace(/@\w+/g, '') : ''; // Remove @username
  };
  
  const handleMessage = async (bot, msg, groupCapture, groupSender, mediaGroupBuffer) => {
    try {
      const chatId = msg.chat.id;
  
      if (chatId.toString() === groupCapture) {
        const { caption, photo, video, media_group_id } = msg;
  
        // Verifica se a mensagem faz parte de um grupo de mídia
        if (media_group_id) {
          // Inicializa o buffer se ele não existir
          if (!mediaGroupBuffer[media_group_id]) {
            mediaGroupBuffer[media_group_id] = [];
          }
  
          // Adiciona a mídia ao buffer correspondente
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
          if (mediaGroupBuffer[media_group_id].length >= photo.length || video) {
            await bot.sendMediaGroup(groupSender, mediaGroupBuffer[media_group_id]);
            delete mediaGroupBuffer[media_group_id]; // Limpa o buffer após o envio
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
      console.error('Erro ao processar mensagem:', error.message);
    }
  };
  
  module.exports = { handleMessage };
  