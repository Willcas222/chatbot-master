const {addKeyword} = require("@bot-whatsapp/bot");
const flowEducacion=addKeyword(['1','educacion']).addAnswer(
    ['Pilares de la Propuesta:\n' +
    'Acceso Universal a la Educación Básica y Superior:\n' +
    '\n' +
    'Implementar programas de becas completas para estudiantes de bajos recursos, desde la educación básica hasta la universitaria.\n' +
    'Ampliar la cobertura educativa en zonas rurales mediante la construcción de escuelas y el fortalecimiento de programas educativos en comunidades marginadas.\n' +
    'Digitalización de la Educación:\n' +
    '\n' +
    'Introducir plataformas de aprendizaje en línea gratuitas para estudiantes de todos los niveles, con materiales actualizados y adaptados a las nuevas tecnologías.\n' +
    'Proveer dispositivos tecnológicos (tabletas o computadoras) y acceso a internet para estudiantes en condiciones vulnerables.\n' +
    'Reforma Curricular para Competencias del Siglo XXI:\n' +
    '\n' +
    'Modernizar los planes de estudio con asignaturas como programación, pensamiento crítico, emprendimiento y sostenibilidad ambiental.\n' +
    'Incluir talleres prácticos que preparen a los estudiantes para resolver problemas reales y los conecten con el mercado laboral.'
    ],
    null,
    null,
    null
)
module.exports = flowEducacion