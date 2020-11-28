const express = require('express');
const cors = require('cors');
// const knex = require('knex');
// const bcrypt = require('bcrypt');

const app = express();

// const db = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       user : 'projeto',
//       password : '123d',
//       database : 'smartbrain'
//     }
//   });

//MIDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//ROUTES

// // create helper middleware so we can reuse server-sent events
// const middlewareEnvioServer = (req, res, next) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.flushHeaders();

//     //função de enviar dados
//     const sendEventData = (data) => {
//         const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
//         res.write(sseFormattedResponse);
//     }
    
//     // we are attaching sendEventStreamData to res, so we can use it later
//     Object.assign(res, {sendEventData});
//     next();
// }

// const enviarDados = (req, res, data) => {
//     res.sendEventStreamData(data);
//     // close
//     res.on('close', () => { 
//         clearInterval(interval);
//         res.end();
//     });
// }

// app.get('/atualizacoes',  middlewareEnvioServer, enviarDados)

const leituras = [
    {
      'id': 1234,
      'name': 'DHT22',
      'type': 'temperature',
      'value': 25,
    },
    {
      'id': 4321,
      'name': 'DHT11',
      'type': 'temperature',
      'value': 25,
    }
  ];

app.get('/', (req, res) => {
    res.send("<h1>Você esté em home<h1>");
})
app.get('/dados', (req, res) => res.json(leituras));

app.post('/dados', (req, res) => {
   console.log(req.body)
   res.send("recebido");
});

app.listen(process.env.PORT || 3000, () => {
    console.log('ESPERANDO NA PORTA ${process.env.PORT}');
});