
const { addKeyword } = require('@bot-whatsapp/bot');
const { getOpenAIResponse } = require('../service/openiaservice');


const flowHerpatria = addKeyword(['4', 'heroe', 'patria'])
  .addAnswer(
    ['¡Hola! 👋 Estas en la opción de hijos de nuestros héroes de la Patria. 😊'], 
    { capture: false }, 
    async (_, { flowDynamic }) => {
      try {
        
        const chatGPTResponse = await getOpenAIResponse(
          'Hijo de nuestros héroes de la Patria, conoce la ONG Hijos de Héroes Col.',
          [
            {
              role: 'system',
              content: 'Eres un asistente virtual que proporciona información clara y útil sobre ONGs y sus actividades.',
            },
            {
              role: 'user',
              content: 'Hijo de nuestros héroes de la Patria, conoce la ONG Hijos de Héroes Col.',
            },
          ]
        );

        
        await flowDynamic([
          `¡Bienvenido! 😊 Aquí tienes información importante:\n\n${chatGPTResponse}`,
          'Para más detalles sobre la ONG Hijos de Héroes Col., puedes visitar el siguiente enlace:',
          '[Hijos de Héroes Col. 🌐](https://onghijosdelosheroes.com/sobre-nosotros/)',
        ]);
      } catch (error) {
        console.error('Error al obtener respuesta de ChatGPT:', error);
        
        await flowDynamic(
          'Lo siento mucho 😔. Ocurrió un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde. ¡Gracias por tu comprensión! 🙏'
        );
      }
    }
  );

module.exports = flowHerpatria;

