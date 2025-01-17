require('dotenv').config();
const { addKeyword } = require('@bot-whatsapp/bot');

const { getOpenAIResponse } = require('../service/openiaservice'); 


const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowAsesor = addKeyword(['6', 'asesor'])
  .addAnswer(['Esta es la opción para comunicarte con un asesor.'])
  .addAnswer(['Por favor, describe la consulta que deseas hacer'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const problemDescription = ctx.body?.trim();
      
      if (!problemDescription || problemDescription === '') {
        await flowDynamic('El tiempo ha expirado. El proceso se ha finalizado.');
      } else {
        await state.update({ problemDescription });

        // Supón que aquí tienes una función para obtener la respuesta de ChatGPT
        const chatGPTResponse = await getOpenAIResponse(problemDescription);

        await flowDynamic(`Gracias por compartir la situación. Aquí tienes algunos consejos sobre cómo solucionar esta problemática:\n\n${chatGPTResponse}`);

      }
    }
  );

module.exports = flowAsesor;
