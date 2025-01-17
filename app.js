const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
require('dotenv').config();
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const {getAudioWaveform, delay} = require("@whiskeysockets/baileys");
const flowConsejo = require('./flow/flowConsejo.js');
const flowPropiedad = require('./flow/flowPropiedad.js');
const flowHerpatria = require('./flow/flowHerpatria.js');
const flowGrevigilancia = require('./flow/flowGrevigilancia.js');
const flowAsesor = require('./flow/flowAsesor.js');


/* menu principal */
const WAITING_TIME = Number(process.env.WAITING_TIME);
const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('Ey soy tu asistente virtual podrias darme tu nombre seria para brindar una mejor atencion',
        {
            capture: true,
            idle: WAITING_TIME
           
        },
        async (ctx,{flowDynamic,state})=>{
            await state.update({name: ctx.body})
            const data = state.getMyState()
            /*await flowDynamic(`Gracias ${data.name}`)*/
        }

    )
    .addAnswer('‎',
        {
            delay: 2000
        },
        async (_, { flowDynamic, state }) => {
            const data = state.getMyState()
            await flowDynamic(
                `¡Hola! ${data.name} soy el asistente virtual del representante a la Cámara José Jaime Uscategui.¿Cómo puedo ayudarte hoy?`)
        }

    )
    .addAnswer(
        [
            '✅  Digita el *número de opción* para brindarte mas información:\n',
            '👉 *1* Consejo de seguridad en tu localidad.\n',
            '👉 *2* Información sobre Propiedad Horizontal.\n',
            '👉 *3* Información sobre Salud Mental\n',
            '👉 *4* Si eres hijo de nuestros héroes de la Patria conoce la ONG Hijos de Héroes Col.\n',
            '👉 *5* Si perteneces al gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.\n',
            '👉 *6* Comunicarse con un asesor.\n',
            '👉 *7* Agendar una cita\n',
        ],
        {
            capture: true, idle: WAITING_TIME
        },
        async (_, { flowDynamic})=> {
            {
                await flowDynamic('Ups, parece que seleccionaste una opción inválida. Intenta nuevamente.');
            }
        },
        [flowConsejo,flowPropiedad,flowHerpatria,flowGrevigilancia,flowAsesor]
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