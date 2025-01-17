require('dotenv').config();
const { addKeyword } = require('@bot-whatsapp/bot');
const { getOpenAIResponse } = require('../service/openiaservice'); 


const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowConsejo = addKeyword(['consejo', '1'])
  .addAnswer('¡Hola! 👋 Estas en la opción del consejo de seguridad. 😊')
  .addAnswer(
    [
      '👮🏻‍♂️ *¿Qué es el consejo de seguridad?*\n',
      'El consejo de seguridad está aquí para apoyarte y escucharte sobre los problemas relacionados con la seguridad en tu localidad. 🛡️ Si tienes alguna preocupación, ¡estamos listos para ayudarte! 😊',
    ],
    null,
    null
  )
  .addAnswer(
    ['Por favor, describe la problemática relacionada con la seguridad en tu localidad. 📝'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const problemDescription = ctx.body?.trim();

      if (!problemDescription || problemDescription === '') {
        await flowDynamic('⏳ El tiempo ha expirado. El proceso se ha finalizado. ¡Vuelve cuando lo necesites! 🙏');
      } else {
        await state.update({ problemDescription });

        const chatGPTResponse = await getOpenAIResponse(problemDescription, [
          {
            role: 'system',
            content: 'Eres un asistente virtual amigable que proporciona consejos prácticos sobre seguridad basados en la situación descrita por el usuario.',
          },
          {
            role: 'user',
            content: `La problemática descrita por el usuario es: ${problemDescription}. ¿Qué consejos de seguridad puedes ofrecer para prevenir o solucionar esta situación?`,
          },
        ]);

        await flowDynamic(`Gracias por compartir tu situación. 🤝 Aquí tienes algunos consejos que podrían ayudarte:\n\n${chatGPTResponse}`);
      }
    }
  )
  .addAnswer(
    [
      'Tu problemática es muy importante para nosotros. 😊 Por favor, ingresa tus datos para que podamos contactarte:',
      '👉 Primero, dinos tu *nombre*.',
    ],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('⏳ Se acabó el tiempo para ingresar el nombre. El proceso se ha finalizado. 😔');
      } else {
        await state.update({ name: ctx.body });
        await flowDynamic('¡Gracias! 😊');
      }
    }
  )
  .addAnswer(
    ['Ahora, por favor ingresa tu *número de teléfono*. 📞'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('⏳ Se acabó el tiempo para ingresar el teléfono. El proceso se ha finalizado. 😔');
      } else {
        await state.update({ phone: ctx.body });
        await flowDynamic('¡Perfecto! 👍');
      }
    }
  )
  .addAnswer(
    ['Por favor, ingresa tu *documento de identidad*. 🆔'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('⏳ Se acabó el tiempo para ingresar el documento de identidad. El proceso se ha finalizado. 😔');
      } else {
        await state.update({ document: ctx.body });
        await flowDynamic('¡Gracias! 😊');
      }
    }
  )
  .addAnswer(
    ['Finalmente, ingresa tu *correo electrónico*. 📧'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('⏳ Se acabó el tiempo para ingresar el correo electrónico. El proceso se ha finalizado. 😔');
      } else {
        await state.update({ email: ctx.body });
        const { name, phone, document, email } = state.getMyState();
        await flowDynamic([
          '¡Gracias! Ahora, por favor confirma los datos que nos proporcionaste: 😊',
          `- *Nombre:* ${name}\n- *Teléfono:* ${phone}\n- *Documento de Identidad:* ${document}\n- *Correo:* ${email}`,
        ]);
      }
    }
  )
  .addAnswer(
    ['¿Son estos datos correctos? Responde *"sí"* o *"no"*. 🤔'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const confirmation = ctx.body?.trim().toLowerCase();

      if (confirmation === 'sí' || confirmation === 'si') {
        await flowDynamic('¡Gracias por confirmar! ✅ Tus datos han sido registrados y pronto nos comunicaremos contigo. 📞📧');
      } else if (confirmation === 'no') {
        await flowDynamic('Lo siento. Por favor, reinicia el proceso para corregir tus datos. Este chat ha finalizado. 🔄');
      } else {
        await flowDynamic('Lo siento, no entendí tu respuesta. Por favor, responde con *"sí"* o *"no"*. 😊');
      }
    }
  );

module.exports = flowConsejo;

