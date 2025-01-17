require('dotenv').config();
const {  addKeyword } = require('@bot-whatsapp/bot')
const { getOpenAIResponse } = require('../service/openiaservice')


const WAITING_TIME = Number(process.env.WAITING_TIME);

const flowPropiedad = addKeyword(['propiedad', '2', 'horizontal'])
  .addAnswer('¡Hola! 👋 Estás en la opción de Propiedad Horizontal. 😊')
  .addAnswer(
    '¿Qué es la Propiedad Horizontal? 🏢\n\nLa Propiedad Horizontal es un régimen jurídico que regula la propiedad y administración de inmuebles divididos en unidades independientes, pero que comparten áreas comunes. Esto es común en edificios de apartamentos, conjuntos residenciales, entre otros.\n\n¿Listo para contarme tu caso? 😊',
    null,
    null
  )
  .addAnswer(
    ['Por favor, describe brevemente la situación que deseas solucionar en relación con la Propiedad Horizontal. Estoy aquí para ayudarte. 📝'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const problemDescription = ctx.body?.trim();

      if (!problemDescription || problemDescription === '') {
        await flowDynamic('Parece que no recibí tu respuesta a tiempo. 😕 Si deseas intentarlo de nuevo, no dudes en escribirme.');
      } else {
        await state.update({ problemDescription });

        const chatGPTResponse = await getOpenAIResponse(problemDescription, [
          {
            role: 'system',
            content: 'Eres un asistente virtual enfocado en dar consejos prácticos de seguridad y administración en Propiedad Horizontal.',
          },
          {
            role: 'user',
            content: `La problemática descrita por el usuario es: ${problemDescription}. ¿Qué consejos puedes ofrecer para solucionar esta situación?`,
          },
        ]);

        await flowDynamic(
          `Gracias por contarme tu situación. 😊 Aquí tienes algunos consejos que podrían ayudarte a solucionarla:\n\n${chatGPTResponse}`
        );
      }
    }
  )
  .addAnswer(
    ['Tu situación es muy importante para nosotros. 😊 Para poder ayudarte mejor, necesitamos algunos datos.'],
    null,
    null
  )
  .addAnswer(
    ['Por favor, ingresa tu nombre completo. ¡Queremos saber cómo llamarte! 😊'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('Parece que no recibí tu nombre. 😅 Si quieres intentarlo de nuevo, solo escríbeme.');
      } else {
        await state.update({ name: ctx.body });
        await flowDynamic('¡Gracias por compartir tu nombre! 😊');
      }
    }
  )
  .addAnswer(
    ['Ahora, ¿puedes darme tu número de teléfono? Esto es para mantenernos en contacto contigo. 📞'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('No recibí tu número a tiempo. 😕 Si deseas intentarlo de nuevo, no dudes en escribirme.');
      } else {
        await state.update({ phone: ctx.body });
        await flowDynamic('¡Perfecto! Gracias por compartir tu número. 😊');
      }
    }
  )
  .addAnswer(
    ['Por favor, escribe tu documento de identidad. Esto nos ayudará a identificar tu caso. 🆔'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('No recibí tu documento de identidad. 😅 Si quieres intentarlo de nuevo, solo escríbeme.');
      } else {
        await state.update({ document: ctx.body });
        await flowDynamic('¡Gracias! Ya casi terminamos. 😊');
      }
    }
  )
  .addAnswer(
    ['Por último, ¿puedes compartir tu correo electrónico? Esto nos ayudará a enviarte información importante. 📧'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      if (!ctx.body || ctx.body.trim() === '') {
        await flowDynamic('Parece que no recibí tu correo electrónico. 😕 Si quieres intentarlo de nuevo, solo escríbeme.');
      } else {
        await state.update({ email: ctx.body });
        await flowDynamic(
          '¡Gracias! Ahora, revisemos los datos que nos proporcionaste:'
        );
        const { name, phone, document, email } = state.getMyState();
        await flowDynamic(`📋 Datos ingresados:\n\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Documento de identidad: ${document}\n- Correo: ${email}`);
      }
    }
  )
  .addAnswer(
    ['¿Son estos datos correctos? Por favor responde "sí" o "no". 😊'],
    { capture: true, idle: WAITING_TIME },
    async (ctx, { state, flowDynamic }) => {
      const confirmation = ctx.body?.trim().toLowerCase();

      if (confirmation === 'sí' || confirmation === 'si') {
        await flowDynamic('¡Genial! Los datos han sido registrados con éxito. ✅ Muy pronto nos pondremos en contacto contigo por WhatsApp o correo electrónico. ¡Gracias por tu paciencia! 😊');
      } else if (confirmation === 'no') {
        await flowDynamic('Entendido. Por favor, reinicia el proceso para corregir los datos. ¡Gracias por tu tiempo! 😊');
      } else {
        await flowDynamic('Lo siento, no entendí tu respuesta. Por favor responde con "sí" o "no".');
      }
    }
  );

module.exports = flowPropiedad;
