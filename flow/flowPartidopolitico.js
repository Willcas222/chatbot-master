const {addKeyword} = require("@bot-whatsapp/bot");

const flowPartidopolitico = addKeyword(['2', 'partido', 'politico'])
    .addAnswer(
        [
            'El Partido Futuro Unido se compromete a crear una nación más inclusiva, sostenible y próspera. ' +
            'Trabajamos para garantizar que todos los ciudadanos, independientemente de su origen o situación social, tengan acceso a oportunidades educativas, laborales y de salud. ' +
            'Nuestra misión es lograr un país en el que se prioricen los derechos humanos, la justicia social y la protección del medio ambiente.',
            'Conoce nuestra página web: https://futuro.unido.com',
        ],
        null,
        async (_, { flowDynamic }) => {
            await flowDynamic('¡Yo sé que buscas el cambio como nosotros, únete a nuestro equipo!');
        }
    );
module.exports = flowPartidopolitico


