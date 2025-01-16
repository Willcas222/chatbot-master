require('dotenv').config();
const { OpenAI } = require('openai'); // Importar correctamente la clase OpenAI

// Configuración de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Usar la clave de API
});

/**
 * Función para obtener la respuesta de OpenAI.
 * @param {string} message - El mensaje del usuario.
 * @returns {Promise<string>} - La respuesta de OpenAI.
 */
const getOpenAIResponse = async (message) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Cambia aquí al modelo gpt-3.5-turbo
            messages: [
                { role: 'system', content: 'Eres un asistente virtual útil y amigable.' },
                { role: 'user', content: message },
            ],
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error al obtener la respuesta de OpenAI:', error.message);
        return 'Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
    }
};

module.exports = { getOpenAIResponse };
