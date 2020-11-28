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

let now = {
    'co': ['a','b'],
    'co2': ['a','b'],
    'o3': ['a','b'],
    'no2': ['a','b'],
    'so2': ['a','b'],
};
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
    res.send("<h1>Você está em home<h1>");
})
app.get('/dados', (req, res) => res.json(now));

app.post('/dados', (req, res) => {
   console.log(req.body);
   const leitura = {
        'co': [req.body.ppm[0], req.body.ugm3[0]],
        'co2': [req.body.ppm[1], req.body.ugm3[1]],
        'o3': [req.body.ppm[2], req.body.ugm3[2]],
        'no2': [req.body.ppm[3], req.body.ugm3[3]],
        'so2': [req.body.ppm[4], req.body.ugm3[4]],
   };
   Object.assign(now, leitura);
   res.send("recebido");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`ESPERANDO NA PORTA ${process.env.PORT}`);
});