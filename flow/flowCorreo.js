const { addKeyword } = require('@bot-whatsapp/bot');

const flowCorreo = addKeyword(['correo', '1']).addAnswer(
    'Por favor, ingresa tu correo:',
    {
        capture: true, // Activa la captura de mensajes del usuario.
    },
    async (ctx, { flowDynamic, state }) => {
        // Guarda el correo en el estado.
        await state.update({ email: ctx.body });

        // Envía un mensaje de confirmación al usuario.
        await flowDynamic(['Gracias, revisa la bandeja de entrada de tu correo.']);
    }
);

module.exports = flowCorreo;
