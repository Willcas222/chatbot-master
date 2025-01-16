const {addKeyword} = require("@bot-whatsapp/bot");
const flowAtencionperso = addKeyword(['3', 'atencion', 'personalizada'])
    .addAnswer('Entendido. Para brindarte la mejor atención, por favor compárteme algunos datos:')

    // Respuesta para capturar el nombre
    .addAnswer(
        ['ingresa tu nombre'],
        { capture: true },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ name1: ctx.body });


        }
    )

    // Respuesta para capturar el número de documento
    .addAnswer(
        ['ingresa tu numero documento'],
        { capture: true, idle: 10000 },
        async (ctx, { flowDynamic, state }) => {
            await state.update({ document: ctx.body });


        }
    )

    // Respuesta final mostrando los datos recopilados
    .addAnswer(
        ['tus datos son:'],
        null,
        async (_, { flowDynamic, state }) => {
            const data = state.getMyState();
            await flowDynamic(`Nombre: ${data.name1}, Documento: ${data.document},\nen un meomento un asesor se pondra en contacto contigo`);  // Responde con los datos
        }
    );
module.exports = flowAtencionperso