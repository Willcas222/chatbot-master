const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
require('dotenv').config();
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const flowConsejo = require('./flow/flowConsejo.js');
const flowPropiedad = require('./flow/flowPropiedad.js');
const flowHerpatria = require('./flow/flowHerpatria.js');
const flowGrevigilancia = require('./flow/flowGrevigilancia.js');
const flowAsesor = require('./flow/flowAsesor.js');
const flowAgendar = require('./flow/flowAgendar.js');



/* menu principal */
const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowPrincipal = addKeyword(EVENTS.WELCOME,'volver')
  .addAnswer(
    '👋 ¡Hola! Soy tu asistente virtual. 😊 Por favor, ¿me podrías decir tu *nombre*? Esto me ayudará a brindarte una atención más personalizada. 🙏',
    {
      capture: true,
      idle: WAITING_TIME,
    },
    async (ctx, { flowDynamic, state }) => {
      await state.update({ name: ctx.body });
    }
  )
  .addAnswer(
    '‎', 
    {
      delay: 2000,
    },
    async (_, { flowDynamic, state }) => {
      const data = state.getMyState();
      await flowDynamic(
        `¡Hola, ${data.name}! 👋 Soy el asistente virtual del representante a la Cámara José Jaime Uscategui. 🏛️\n\n¿Cómo puedo ayudarte hoy? 🤔`
      );
    }
  )
  .addAnswer(
    [
      '✅ Por favor, digita el *número de opción* para obtener más información:\n',
      '👉 *1* Consejo de seguridad en tu localidad.\n',
      '👉 *2* Información sobre Propiedad Horizontal.\n',
      '👉 *3* Información sobre Salud Mental.\n',
      '👉 *4* Si eres hijo de nuestros héroes de la Patria, conoce la ONG Hijos de Héroes Col.\n',
      '👉 *5* Si perteneces al gremio de la vigilancia y seguridad, conoce a FUNVIGIAS.\n',
      '👉 *6* Comunicarse con un asesor.\n',
      '👉 *7* Agendar una cita.\n',
    ],
    {
      capture: true,
      idle: WAITING_TIME,
    },
    async (ctx, { flowDynamic }) => {
      const selectedOption = ctx.body?.trim();
      const validOptions = ['1', '2', '3', '4', '5', '6', '7'];

      if (!validOptions.includes(selectedOption)) {
        await flowDynamic('⚠️ Ups, parece que seleccionaste una opción inválida. Por favor, intenta nuevamente ingresando un número del 1 al 7. 🙏');
      }
    },
    [flowConsejo, flowPropiedad, flowHerpatria, flowGrevigilancia, flowAsesor,flowAgendar]
  );

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