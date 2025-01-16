const { addKeyword } = require('@bot-whatsapp/bot');
const { getOpenAIResponse } = require('../service/openiaservice');


const flowGrevigilancia =addKeyword(['5','vigilancia','gremio'])
.addAnswer(
    ['Estas en la opción del gremio de la vigilancia y seguridad.'], 
    { capture: false }, 
    async (_, { flowDynamic }) => {
        try {
            
            const chatGPTResponse = await getOpenAIResponse(
                'gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.',
                [
                    {
                        role: 'system',
                        content: 'Eres un asistente virtual que proporciona información sobre gremios y sus actividades.',
                    },
                    {
                        role: 'user',
                        content: 'gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.',
                    },
                ]
            );

            
            await flowDynamic([
                `¡Bienvenido! ${chatGPTResponse}`,
                'Puedes obtener más información visitando el siguiente enlace:',
                '[vigilancia y seguridad FUNVIGIAS.](https://sites.google.com/view/funvigiascol/qui%C3%A9nes-somos)',
            ]);
        } catch (error) {
            console.error('Error al obtener respuesta de ChatGPT:', error);
            await flowDynamic(
                'Lo siento, ocurrió un problema al procesar tu solicitud. Intenta de nuevo más tarde.'
            );
        }
    }
);
module.exports =flowGrevigilancia