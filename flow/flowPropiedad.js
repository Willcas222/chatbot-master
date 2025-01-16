require('dotenv').config();
const {  addKeyword } = require('@bot-whatsapp/bot')
const { getOpenAIResponse } = require('../service/openiaservice')


const WAITING_TIME = Number(process.env.WAITING_TIME);
const flowPropiedad =addKeyword(['propiedad','2','horizontal'])
    .addAnswer('Estas en la opción Propiedad Horizontal.')
    .addAnswer('¿Qué es la Propiedad Horizontal.?La Propiedad Horizontal es un régimen jurídico que regula la propiedad y administración de los inmuebles que están divididos en unidades de propiedad independiente, pero que comparten áreas comunes. Este régimen es común en edificios de apartamentos, conjuntos residenciales o cualquier inmueble que esté dividido en partes con propietarios diferentes, pero que utilicen ciertas áreas o servicios comunes, como pasillos, ascensores, jardines, estacionamientos, etc.', 
     null,
     null
    )
    .addAnswer(
        ['Por favor, describe la problemática que tienes dea caurdo con la propiedad horizontal'],
        { capture: true, idle:WAITING_TIME  },
        async (ctx, { state, flowDynamic }) => {
            
            const problemDescription = ctx.body?.trim();
    
            if (!problemDescription || problemDescription === '') {
                await flowDynamic('El tiempo ha expirado. El proceso se ha finalizado.');
            } else {
                
                await state.update({ problemDescription });
    
              
                const chatGPTResponse = await getOpenAIResponse(problemDescription, [
                    {
                        role: 'system',
                        content: 'Eres un asistente virtual enfocado en dar consejos prácticos de seguridad basados en la situación descrita por el usuario.',
                    },
                    {
                        role: 'user',
                        content: `La problemática descrita por el usuario es: ${problemDescription}. ¿Qué consejos de la propiedad horizontal puedes ofrecer para solucionar esta situación?`,
                    },
                ]);
    
                
                await flowDynamic(`Gracias por compartir la situación. Aquí tienes algunos consejos sobre como solucionar problemas con respecto a la propiedad horizontal:\n\n${chatGPTResponse}`);
    
                
            }
        }
    )
    .addAnswer(
        [   'tu problematica es importante para nosotros por favor ingresa tus datos para contactarte\n',
            'Para continuar, por favor ingresa tu nombre.'],
        { capture: true, idle: WAITING_TIME },  
        async (ctx, { state, flowDynamic }) => {
            if (!ctx.body || ctx.body.trim() === '') {
                await flowDynamic('Se acabó el tiempo para ingresar el nombre. El proceso se ha finalizado.');
            } else {
                await state.update({ name: ctx.body }); 
                await flowDynamic('Gracias.');
            }
        }
    )
    .addAnswer(
        ['Ingresa tu teléfono'],
        { capture: true, idle: WAITING_TIME},  
        async (ctx, { state, flowDynamic }) => {
            if (!ctx.body || ctx.body.trim() === '') {
                await flowDynamic('Se acabó el tiempo para ingresar el teléfono. El proceso se ha finalizado.');
            } else {
                await state.update({ phone: ctx.body });
                await flowDynamic('Gracias.');
            }
        }
    )
    .addAnswer(
        ['Ingresa tu documento de identidad'],
        { capture: true, idle: WAITING_TIME }, 
        async (ctx, { state, flowDynamic }) => {
            if (!ctx.body || ctx.body.trim() === '') {
                await flowDynamic('Se acabó el tiempo para ingresar el documento de identidad. El proceso se ha finalizado.');
            } else {
                await state.update({ document: ctx.body });  
                await flowDynamic('Gracias.');
            }
        }
    )
    .addAnswer(
        ['Ingresa tu correo electrónico'],
        { capture: true, idle: WAITING_TIME },  
        async (ctx, { state, flowDynamic }) => {
            if (!ctx.body || ctx.body.trim() === '') {
                await flowDynamic('Se acabó el tiempo para ingresar el correo electrónico. El proceso se ha finalizado.');
            } else {
                await state.update({ email: ctx.body });  
                await flowDynamic('Gracias. Ahora, por favor confirma los siguientes datos:');
                const { name, phone, document, email } = state.getMyState();
                await flowDynamic(`Nombre: ${name}\nTeléfono: ${phone}\nDocumento de Identidad: ${document}\nCorreo: ${email}`);
            }
        }
    )
    .addAnswer(
        ['¿Son estos datos correctos? Responde "sí" o "no".'],
        { capture: true, idle: WAITING_TIME },  
        async (ctx, { state, flowDynamic }) => {
            const confirmation = ctx.body?.trim().toLowerCase();
    
            if (confirmation === 'sí' || confirmation === 'si') {
                await flowDynamic('¡Gracias por confirmar! Los datos han sido registrados pronto se comunicaran contigo por estos medios como whatsaspp o correo electronico.');
            } else if (confirmation === 'no') {
                await flowDynamic('Por favor, reinicia nuevamente el proceso. Este chat ha finalizado.');
            } else {
                await flowDynamic('No entendí tu respuesta. Por favor, responde "sí" o "no".');
            }
        }
    );
    
module.exports =flowPropiedad;