const { addKeyword } = require('@bot-whatsapp/bot');
const { getOpenAIResponse } = require('../service/openiaservice');
const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowGrevigilancia = addKeyword(['5', 'vigilancia', 'gremio'])
  .addAnswer(
    ['¡Hola! 👋 Estas en la opción del gremio de la vigilancia y seguridad. 😊'],
    { capture:false },
    async (_, { flowDynamic }) => {
      try {
        const chatGPTResponse = await getOpenAIResponse(
          'gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.',
          [
            {
              role: 'system',
              content: 'Eres un asistente virtual que proporciona información clara y útil sobre gremios y sus actividades.',
            },
            {
              role: 'user',
              content: 'gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.',
            },
          ]
        );

        // Respuesta al usuario
        await flowDynamic([
          `¡Bienvenido! 😊 Aquí tienes información importante:\n\n${chatGPTResponse}`,
          'Si deseas más detalles sobre el gremio de vigilancia y seguridad, visita el siguiente enlace:',
          '[FUNVIGIAS 🌐](https://sites.google.com/view/funvigiascol/qui%C3%A9nes-somos)',
        ]);
      } catch (error) {
        console.error('Error al obtener respuesta de ChatGPT:', error);
        // Manejo de errores
        await flowDynamic(
          'Lo siento mucho 😔. Ocurrió un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde. ¡Gracias por tu comprensión! 🙏'
        );
      }
    }
  );
  
  

module.exports = flowGrevigilancia;
