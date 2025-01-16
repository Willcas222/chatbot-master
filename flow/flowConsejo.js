require('dotenv').config();
const { addKeyword } = require('@bot-whatsapp/bot');
const { getOpenAIResponse } = require('../service/openiaservice'); 


const WAITING_TIME = Number(process.env.WAITING_TIME);
const flowConsejo = addKeyword(['consejo', '1'])
    .addAnswer('Estas en la opción del consejo de seguridad.')
    .addAnswer('¿Qué es el consejo de seguridad? El consejo de seguridad es para apoyarte y escucharte con los problemas que presentes en tu localidad. ', 
         null,
         null
    )
    .addAnswer(
        ['Por favor, describe la problemática relacionada con la seguridad en tu localidad.'],
        { capture: true, idle: WAITING_TIME },
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
                        content: `La problemática descrita por el usuario es: ${problemDescription}. ¿Qué consejos de seguridad puedes ofrecer para prevenir esta situación?`,
                    },
                ]);
    
                
                await flowDynamic(`Gracias por compartir la situación. Aquí tienes algunos consejos para mejorar la seguridad:\n\n${chatGPTResponse}`);
    
                
            }
        }
    )
    .addAnswer(
        [   'tu problematica es importante para nosotros por favor ingresa tus datos para contactarte',
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
        { capture: true, idle: WAITING_TIME },  
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
        { capture: true, idle: WAITING_TIME},  
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
    )
    

module.exports = flowConsejo;
