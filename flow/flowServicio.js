const {addKeyword} = require("@bot-whatsapp/bot");
const flowServicio = addKeyword(['4','servicio']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    []
)
module.exports = flowServicio