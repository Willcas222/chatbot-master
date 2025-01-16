const { addKeyword } = require('@bot-whatsapp/bot');
const flowCorreo = require('./flowCorreo.js');
const flowAsesor = require('./flowAsesor.js'); // Verifica que este archivo existe y está configurado.

const flowEconomia = addKeyword(['3', 'economia', 'economía']).addAnswer(
    [
        'El plan económico del candidato está diseñado para [describir brevemente las propuestas clave, como generación de empleo, apoyo a empresas, reducción de impuestos, etc.].',
        '¿Te gustaría recibir un resumen detallado por correo o hablar con un asesor sobre este tema?',
        '\n1️⃣ Enviar resumen por correo\n2️⃣ Hablar con un asesor',
    ],
    null,
    null,
    [flowCorreo, flowAsesor]
);

module.exports = flowEconomia;
