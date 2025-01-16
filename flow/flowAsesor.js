const {addKeyword} = require("@bot-whatsapp/bot");
const flowAsesor =addKeyword(['asesor','2']).addAnswer(
    ['¡claro que si!  si deseas comunicarte con nosotros y conocer mas informacion sobre esta revolcuion' +
    'y el cambio que nuesto pais busca puedes comunicarte al 312xxxxxxx o 315xxxxxx'
    ],
    {
        capture: true, idle: 10000
    },
    async (_, { flowDynamic})=> {
        await flowDynamic('!ya te vas¡🙃 todavia hay mucho por conocer ')
    }

)
module.exports = flowAsesor