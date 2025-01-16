const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const {getAudioWaveform} = require("@whiskeysockets/baileys");
const { getOpenAIResponse } = require('./service/openiaservice.js');
const flowPropuestas = require('./flow/flowPropuestas.js');

const flowChatGPT = addKeyword(['inteligencia', 'chatgpt', 'ai'])
    .addAnswer(
    ['¿Qué te gustaría preguntarle a ChatGPT?'],
    { capture: true },
    async (ctx, { flowDynamic }) => {
        const userMessage = ctx.body; // El mensaje ingresado por el usuario
        const response = await getOpenAIResponse(userMessage); // Obtiene la respuesta de OpenAI
        await flowDynamic(response); // Responde al usuario con el resultado
    }
);

/* menu principal */

const flowPrincipal = addKeyword(['hola', 'ole', 'alo','buenas','eo'])
    .addAnswer('Ey soy tu asistente virtual podrias darme tu nombre seria para brindar una mejor atencion',
        {
            capture: true,
            idle: 10000
        },
        async (ctx,{flowDynamic,state})=>{
            await state.update({name: ctx.body})
            const data = state.getMyState()
            await flowDynamic(`Gracias ${data.name}`)
        }

    )
    .addAction(
        async (ctx, { provider }) =>{
            await provider.vendor.sendMessage(
                ctx.key.remoteJid,{
                    image: {url: './interview-8843641_640.jpg'}
                }
            )
        }

    )
    .addAnswer('‎',
        null,
        async (_, { flowDynamic, state }) => {
            const data = state.getMyState()
            await flowDynamic(`¡Hola! ${data.name} Soy el asistente virtual del candidato al senado William pepito. Estoy aquí para ayudarte con información sobre sus propuestas, el partido político y también para conectar contigo si necesitas asesoría personalizada. ¿Cómo puedo ayudarte hoy?`)
        }

    )
    .addAnswer(
        [
            '               👨‍👩‍👦Seleciona una opcion',
            '👉 *1*  Conocer las propuestas del candidato',
            '👉 *2*  Información sobre el partido político',
            '👉 *3*  Solicitar atención personalizada',
            '👉 *4*  Buscar un servicio específico',
        ],
        {
            capture: true, idle: 10000
        },
        async (_, { flowDynamic})=> {
            await flowDynamic('🥺ups creo que te fuistes o se te apago el celular 🥺')
        },
        [flowChatGPT,flowPropuestas]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()