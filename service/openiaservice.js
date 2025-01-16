require('dotenv').config();
const { OpenAI } = require('openai'); 


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

/**
 * @param {string} message 
 * @returns {Promise<string>} 
 */
const getOpenAIResponse = async (message) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', 
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
