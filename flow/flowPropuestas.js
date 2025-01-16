const { addKeyword } = require('@builderbot/bot')


const flowPropuestas = addKeyword(['1', 'propuestas', 'candidato']).addAnswer(
    [
        '¡Claro! Nuestro candidato tiene un enfoque en temas clave como educación, salud, economía, etc.',
        'Por favor, selecciona el tema que más te interese:\n1️⃣ Educación 📚\n2️⃣ Salud 🏥\n3️⃣ Economía 💼\n4️⃣ Medio ambiente 🌱\n5️⃣ Seguridad 🚓',
    ],
    {
        capture: true,
        idle: 10000,
    },
    async (_, { flowDynamic }) => {
        await flowDynamic(['🥺 Ups, creo que te fuiste o se te apagó el celular. 🥺']);
    },
    null// Asegúrate de que ambos flujos son válidos.
);
module.exports = flowPropuestas;


