require('dotenv').config();
const { getOpenAIResponse } = require('./service/openiaservice.js'); // Cambia la ruta según tu estructura

(async () => {
    const response = await getOpenAIResponse('Escribe un poema sobre el universo.');
    console.log('Respuesta de OpenAI:', response);
})();
