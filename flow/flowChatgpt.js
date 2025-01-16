const {addKeyword} = require("@bot-whatsapp/bot");
const {getOpenAIResponse} = require("../service/openiaservice");
const flowChatGPT = addKeyword(['inteligencia', 'chatgpt', 'ai']).addAnswer(
    ['¿Qué te gustaría preguntarle a ChatGPT?'],
    { capture: true },
    async (ctx, { flowDynamic }) => {
        const userMessage = ctx.body; // El mensaje ingresado por el usuario
        const response = await getOpenAIResponse(userMessage); // Obtiene la respuesta de OpenAI
        await flowDynamic(response); // Responde al usuario con el resultado
    }
);
module.exports =flowChatGPT