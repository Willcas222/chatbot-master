require('dotenv').config();
const { addKeyword } = require('@builderbot/bot');

// Objeto global para mantener el estado (para pruebas locales)
let userState = {};

const flowAgendar = addKeyword(['7', 'agendar'])
  .addAnswer('¡Hola! 😊 Para agendar tu cita, por favor responde las siguientes preguntas:')
  .addAnswer(
    '📅 ¿Qué fecha prefieres para tu cita? (Ejemplo: 25-01-2025)',
    { capture: true },
    async (ctx, { flowDynamic }) => {
      const date = ctx.body;
      if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        await flowDynamic('❌ Fecha inválida. Por favor, usa el formato DD-MM-AAAA.');
        return;
      }
      userState[ctx.from] = { date }; // Asocia los datos al usuario
      console.log('Fecha capturada:', userState[ctx.from]);
    }
  )
  .addAnswer(
    '🕒 ¿A qué hora prefieres? (Ejemplo: 08:30 o 15:30)',
    { capture: true },
    async (ctx, { flowDynamic }) => {
      const time = ctx.body;
      if (!/^\d{2}:\d{2}$/.test(time)) {
        await flowDynamic('❌ Hora inválida. Por favor, usa el formato HH:MM.');
        return;
      }
      userState[ctx.from] = { ...userState[ctx.from], time };
      console.log('Hora capturada:', userState[ctx.from]);
    }
  )
  .addAnswer(
    '📋 ¿Cuál es el motivo de la cita?',
    { capture: true },
    async (ctx, { flowDynamic }) => {
      const reason = ctx.body;
      userState[ctx.from] = { ...userState[ctx.from], reason };
      console.log('Motivo capturado:', userState[ctx.from]);
    }
  )
  .addAnswer(['Por último, ¿puedes compartir tu correo electrónico? Esto nos ayudará a enviarte información importante. 📧'],
    { capture: true },
    async (ctx) => {
      const userData = userState[ctx.from];
      if (!userData) {
        console.error('❌ No se encontraron datos para el usuario:', ctx.from);
        return '❌ Ocurrió un error al recuperar la información de tu cita. Por favor, intenta de nuevo.';
      }

      const { date, time, reason } = userData;
      if (!date || !time || !reason) {
        console.error('❌ Datos incompletos:', userData);
        return '❌ Algunos datos están incompletos. Por favor, intenta de nuevo.';
      }

      return `Perfecto. Aquí está el resumen de tu cita:\n\n📅 Fecha: ${date}\n🕒 Hora: ${time}\n📋 Motivo: ${reason}\n\nPor favor, confirma si esta información es correcta (sí/no).`;
    },
    { capture: true },
    async (ctx, { flowDynamic }) => {
      try {
        const confirmation = ctx.body.toLowerCase();
        if (confirmation === 'sí' || confirmation === 'si') {
          delete userState[ctx.from]; // Limpia los datos del usuario
          await flowDynamic('✅ ¡Tu cita ha sido agendada con éxito! Gracias. 😊');
        } else {
          delete userState[ctx.from]; // Limpia los datos del usuario
          await flowDynamic('❌ Entendido, no se ha agendado la cita. Si deseas volver a intentarlo, escribe "7" o "agendar".');
        }
      } catch (error) {
        console.error('Error al confirmar la cita:', error);
        await flowDynamic('❌ Ocurrió un error durante la confirmación. Intenta de nuevo.');
      }
    }
  );

module.exports = flowAgendar;
