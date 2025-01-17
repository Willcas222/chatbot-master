require('dotenv').config();
const { addKeyword } = require('@bot-whatsapp/bot');

const { getOpenAIResponse } = require('../service/openiaservice'); 


const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowAsesor = addKeyword(['6', 'asesor'])
  .addAnswer(
    '📞 ¡Estás en la opción para comunicarte con un asesor! 😄',
    { capture: false }
  )
  .addAnswer(
    'Por favor, describe la consulta que deseas hacer para que te podamos ayudar mejor. 🤔',
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const problemDescription = ctx.body?.trim();

      if (!problemDescription || problemDescription === '') {
        await flowDynamic('⏳ El tiempo ha expirado. El proceso se ha finalizado. 😞');
      } else {
        await state.update({ problemDescription });

        // Obtener la respuesta de ChatGPT
        const chatGPTResponse = await getOpenAIResponse(problemDescription);

        await flowDynamic(`💡 ¡Gracias por compartir tu situación! Aquí tienes algunos consejos sobre cómo solucionar esta problemática:\n\n${chatGPTResponse}`);

        // Datos de contacto para WhatsApp
        const phoneNumber = '+573058221777';  
        const contactName = 'Duvan Rivera';  

        // Crear el enlace de WhatsApp
        const whatsappLink = `https://wa.me/${phoneNumber}?text=Hola,%20necesito%20más%20información%20sobre%20mi%20consulta.%20${encodeURIComponent(problemDescription)}`;

        // Enviar el enlace de WhatsApp al usuario
        await flowDynamic(`Si necesitas más ayuda, puedes comunicarte directamente con el asesor ${contactName} a través de este [enlace de WhatsApp]( ${whatsappLink} ). 📲`);

        console.log(`Enlace de contacto enviado: ${whatsappLink}`);
      }
    }
  );

module.exports = flowAsesor;

