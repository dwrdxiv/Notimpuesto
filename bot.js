console.log('archivo bot.js cargado');
const {Markup, Telegraf} = require ('telegraf');
const TOKEN = process.env.TOKEN;
const bot = new Telegraf(TOKEN);
const cron = require('node-cron');
const db = require('./db.js');

const autorizados = process.env.AUTH_USERS
const fecha = new Date().toLocaleString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });

const mesesAnio = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let IVA1QFechas = {
    'Enero' : [28, 19, 21, 30, 23, 22, 20, 27, 26, 29],
    'Febrero' : [20, 23, 18, 18, 25, 27, 19, 24, 26, 27],
    'Marzo' : [25, 20, 24, 23, 26, 30, 27, 18, 31, 17],
    'Abril' : [23, 27, 21, 30, 20, 22, 24, 17, 29, 28],
    'Mayo' : [20, 18, 29, 22, 21, 28, 19, 26, 27, 25],
    'Junio' : [29, 26, 16, 18, 19, 17, 30, 22, 23, 25],
    'Julio' : [27, 21, 30, 23, 28, 22, 20, 31, 17, 29],
    'Agosto' : [31, 25, 24, 18, 19, 21, 28, 20, 26, 27],
    'Septiembre' : [29, 18, 24, 21, 30, 25, 28, 22, 17, 23],
    'Octubre' : [20, 28, 29, 23, 22, 30, 21, 27, 26, 19],
    'Noviembre' : [27, 26, 17, 23, 20, 18, 25, 19, 24, 30],
    'Diciembre' : [16, 29, 21, 28, 22, 17, 18, 18, 30, 23]
}; //Fechas Especiales para IVA, Anticipo, IGTF y Retenciones

let IVA2QFechas = {
    'Enero' : [15, 6, 8, 16, 9, 5, 13, 12, 7, 14],
    'Febrero' : [13, 7, 14, 12, 8, 15, 9, 11, 10, 16],
    'Marzo' : [6, 3, 9, 4, 11, 12, 10, 2, 13 ,5],
    'Abril' : [1, 14, 8, 16, 7, 9, 13, 6, 10, 15],
    'Mayo' : [6, 4, 14, 7, 13, 15, 5, 11, 12, 8],
    'Junio' : [12, 11, 3, 10, 2, 8, 15, 4, 5, 9],
    'Julio' : [8, 3, 14, 7, 10, 6, 9, 15, 2, 13],
    'Agosto' : [14, 13, 12, 5, 6, 3, 4, 10, 7, 11],
    'Septiembre' : [14, 3, 10, 2, 9, 15, 11, 4, 8, 7],
    'Octubre' : [5, 14, 15, 7, 6, 8, 2, 13, 9, 1],
    'Noviembre' : [13, 12, 2, 9, 5, 4, 11, 3, 6, 10],
    'Diciembre' : [3, 15, 4, 11, 7, 10, 8, 2, 9, 14]
};  //Fechas Especiales para IVA, Anticipo, IGTF y Retenciones

let DPPFechas = {
    'Enero' : [28, 19, 21, 30, 23, 22, 20, 27, 26, 29],
    'Febrero' : [20, 23, 18, 18, 25, 27, 19, 24, 26, 27],
    'Marzo' : [25, 20, 24, 23, 26, 30, 27, 18, 31, 17],
    'Abril' : [23, 27, 21, 30, 20, 22, 24, 17, 29, 28],
    'Mayo' : [20, 18, 29, 22, 21, 28, 19, 26, 27, 25],
    'Junio' : [29, 26, 16, 18, 19, 17, 30, 22, 23, 25],
    'Julio' : [27, 21, 30, 23, 28, 22, 20, 31, 17, 29],
    'Agosto' : [31, 25, 24, 18, 19, 21, 28, 20, 26, 27],
    'Septiembre' : [29, 18, 24, 21, 30, 25, 28, 22, 17, 23],
    'Octubre' : [20, 28, 29, 23, 22, 30, 21, 27, 26, 19],
    'Noviembre' : [27, 26, 17, 23, 20, 18, 25, 19, 24, 30],
    'Diciembre' : [16, 29, 21, 28, 22, 17, 18, 18, 30, 23]
};   //Fechas DPP

function getTodaySeniat() {
    const hoy = new Date();
    const diaActual = hoy.getDate();
    const mesActual = mesesAnio[hoy.getMonth()];

    const fechasdelMes = IVA1QFechas[mesActual] || IVA2QFechas[mesActual] || DPPFechas[mesActual];
    const terminalesdeHoy = [];

    if (!fechasdelMes) return [];

    fechasdelMes.forEach((diaVencimiento, terminal) => {
        if (diaVencimiento === diaActual) {
            terminalesdeHoy.push(terminal + 1); // Terminales empiezan en 1
        }
    })
    return terminalesdeHoy;
};

function getAnyDateSeniat(diaSolicitado, mesSolicitado) {
    const mesNombre = mesesAnio[mesSolicitado - 1];
    const fechasdelMes = IVA1QFechas[mesNombre];
    const fechasdelMes2 = IVA2QFechas[mesNombre];

    if (!fechasdelMes || !fechasdelMes) return [];
    const terminales = [];

    fechasdelMes.forEach((diaVencimiento, terminal) => {
        if (diaVencimiento === diaSolicitado) {
            terminales.push(terminal); // Terminales empiezan en 1
        }
    });

    fechasdelMes2.forEach((diaVencimiento, terminal) => {
        if (diaVencimiento === diaSolicitado) {
            terminales.push(terminal); // Terminales empiezan en 1
        }
    });
    return terminales;
};

function obtenerPeriodo(dia, mes){
    const anio = new Date().getFullYear();
    const quincena = dia <= 15 ? '2Q' : '1Q';
    const mesFmt = mes.toString().padStart(2, '0');
    return `${anio}-${mesFmt}-${quincena}`;
}

bot.start((ctx) => {
    if (!autorizados.includes(ctx.from.id.toString())) {
        console.log(`Usuario no autorizado: ${ctx.from.id} - ${ctx.from.username}`);
        return ctx.reply('Lo siento, no estás autorizado para usar este comando.');
    }
    ctx.reply('¡Buen día! 👋 \n¿En que te puedo ayudar?', Markup.inlineKeyboard([[Markup.button.callback('Seniat Hoy', 'ConsultaHoy')]]));

});

bot.command('seniat', (ctx) => {
    if (!autorizados.includes(ctx.from.id.toString())) {
        console.log(`Usuario no autorizado: ${ctx.from.id} - ${ctx.from.username}`);
        return ctx.reply('Lo siento, no estás autorizado para usar este comando.');
    }
    const args = ctx.message.text.split(' ');

    if (args.length < 2 ) {
        return ctx.reply('Por favor, ingresa el día y el mes en formato: /seniat Dia/Mes\nEjemplo: /seniat 7/3');
    }
    const [dia, mes] = args[1].split('/').map(Number);
    //Validar Fecha
    if (isNaN(dia) || isNaN(mes) || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
        return ctx.reply('Fecha inválida. Por favor, ingresa el día y el mes en formato: /seniat Dia/Mes\nEjemplo: /seniat 7/3');
    }

    const terminales = getAnyDateSeniat(dia, mes);
    if (terminales.length === 0) {
        return ctx.reply(`No hay pagos de Seniat programados para el ${dia} de ${mesesAnio[mes - 1]}.`);
    }

    const periodo = obtenerPeriodo(dia, mes);
    const terminalesNumericos = terminales.map(Number)
    const placeholders = terminalesNumericos.map(() => '?').join(', ');
    const parametros = [periodo, ...terminalesNumericos];
    
const sql = `SELECT c.id, c.razon_social, c.lastdigit, c.rif, c.condicion, d.estatus FROM clientes c LEFT JOIN declaraciones d ON c.id = d.cliente_id AND d.periodo = ? WHERE c.lastdigit IN (${placeholders}) AND c.condicion = 1`; //
    
    db.all(sql, parametros, (err, filas) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            ctx.reply('Lo siento, hubo un error al consultar los datos.');
            return;
        }
        if (filas.length === 0) {
            ctx.reply(`Hoy ${fecha}\nNo se encontraron clientes para los terminales: ${terminales.join(', ')}.`);
            return;
        }

        let reporte = `Seniat para el ${dia} de ${mesesAnio[mes - 1]}:\n`; reporte += `Terminales: ${terminales.join(', ')}\n${mesesAnio[mes - 1]} ${periodo}\nIVA, IGTF y Anticipos de ISLR\n\n`;
        filas.forEach(cliente => {
            let emoji = '🔴';
            if (cliente.status === 'declarado') emoji = '🟡';
            if (cliente.status === 'pagado') emoji = '🟢';
            reporte += `${cliente.id}) `;
            reporte += `${cliente.razon_social} ${emoji}\n`;
            reporte += `RIF: ${cliente.rif}\n`;
            reporte += `-------------------------------------------------\n`
        });
        ctx.reply(reporte, Markup.inlineKeyboard([[Markup.button.callback('¿Cambiar Status de un Cliente?', `preguntar_id_${periodo}`)]])).catch(err => {
            console.error('Error al enviar el mensaje:', err);
            ctx.reply('Lo siento, hubo un error al enviar los datos.');
        });;

    });
});

bot.action(/preguntar_id_(.+)/, (ctx) => {
    const periodo = ctx.match[1];
    ctx.reply(`Por favor, ingresa el ID del cliente para cambiar su status. en el periodo ${periodo}`).then(() => {
        bot.on('text', (ctx) => {
            const idCliente = parseInt(ctx.message.text);
            if (isNaN(idCliente)) {
                return ctx.reply('ID inválido. Por favor, ingresa un número válido.');
            }
            //Cambiar Status del Cliente
            const sql = 'SELECT * FROM declaraciones WHERE clientes_id = ? AND periodo = ?';
            const parametros2 = [idCliente, periodo];
            db.get(sql, parametros2, (err, fila) => {
                if (err) {
                    console.error('Error al consultar la base de datos:', err);
                    return ctx.reply('Lo siento, hubo un error al consultar los datos.');
                }
                if (!fila) {
                    return ctx.reply('No se encontró una declaración para ese cliente en el periodo especificado.');
                }
                ctx.reply(`Selecciona el nuevo estatus para:\n${fila.clientes_id}\nPeriodo: ${fila.periodo}\nEstatus Actual: ${fila.status}`, 
                Markup.inlineKeyboard([
                    [Markup.button.callback('🔴 Pendiente', `st:pendiente:${idCliente}:${periodo}`)],
                    [Markup.button.callback('🟡 Declarado', `st:declarado:${idCliente}:${periodo}`)],
                    [Markup.button.callback('🟢 Pagado', `st:pagado:${idCliente}:${periodo}`)]
                ]));
            });
        });
    });
});

bot.action(/st:(.+):(.+):(.+)/, (ctx) => {
    const [nuevoStatus, idCliente, periodo] = ctx.match.slice(1);
    const sql = 'INSERT INTO declaraciones (clientes_id, periodo, status) VALUES (?, ?, ?) ON CONFLICT(clientes_id, periodo) DO UPDATE SET status = excluded.status';
    db.run(sql, [nuevoStatus, idCliente, periodo], function(err) {
        if (err) {
            console.error('Error al actualizar la base de datos:', err);
            return ctx.reply('Lo siento, hubo un error al actualizar los datos.');
        }
        if (this.changes === 0) {
            return ctx.reply('No se encontró una declaración para ese cliente en el periodo especificado.');
        }
        ctx.reply(`Estatus actualizado a ${nuevoStatus} para el cliente ID ${idCliente} en el periodo ${periodo}.`);
    });
})


bot.action('ConsultaHoy', (ctx) => {
    if (!autorizados.includes(ctx.from.id.toString())) {
        console.log(`Usuario no autorizado: ${ctx.from.id} - ${ctx.from.username}`);
        return ctx.reply('Lo siento, no estás autorizado para usar este comando.');
    }
    //Select a la DB para buscar quien paga Hoy seniat
    const terminales = getTodaySeniat();
    if (terminales.length === 0) {
        ctx.reply(`Hoy ${fecha}\nNo hay pagos de Seniat programados.`);
        return;
    }

    const placeholders = terminales.map(() => '?').join(', ');
    const sql = 'SELECT razon_social FROM clientes WHERE lastdigit IN (${placeholders})';
    db.all(sql, terminales, (err, filas) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            ctx.reply('Lo siento, hubo un error al consultar los datos.');
            return;
        }
        if (filas.length === 0) {
            ctx.reply(`Hoy ${fecha}\nNo se encontraron clientes para los terminales: ${terminales.join(', ')}.`);
            return;
        }
        let reporte = 'Seniat Programados para HOY:\n'; reporte += 'Terminales: ${terminales.join(', ')}\n\n';
        filas.forEach(cliente => {
            reporte += ' *${cliente.razon_social}\n RIF: ${cliente.rif}\n';
            
        });
        ctx.replyWithMarkdownV2(reporte);
        //const cliente = filas.map(fila => fila.razon_social).join(', ');
    })

    //ctx.reply(`Hoy ${fecha}\nLe corresponde Seniat:\n${cliente}`, Markup.inlineKeyboard([[Markup.button.callback('Consultar Seniat de Mañana?', 'checkTomorrow')]]));

});

//Todos los dias a las 8:00 am
cron.schedule('0 9 * * *', () => {
    //Consultar en la DB el terminal a ver quien le toca hoy
    bot.Telegraph.sendMessage(process.env.AUTH_USERS, 'Hoy paga Inv Maria, C.A.'); //Ejemplo
});

module.exports = bot;