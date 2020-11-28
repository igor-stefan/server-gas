const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'projeto',
      password : '123d',
      database : 'monitoramento-gases'
    }
});

//MIDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//ROUTES

let now = {
    'co': ['a','b'],
    'co2': ['a','b'],
    'o3': ['a','b'],
    'no2': ['a','b'],
    'so2': ['a','b'],
};

app.get('/', (req, res) => {
    res.send("<h1>Você está em home<h1> <br> <h2>Tente a rota /dados<h2>");
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
    db('ppm').insert({
        co: parseFloat(leitura.co[0]),
        co2: parseFloat(leitura.co2[1]),
        o3: parseFloat(leitura.co[2]),
        no2: parseFloat(leitura.co[3]),
        so2: parseFloat(leitura.co[4]),
        tempo: new Date()
    }).then(console.log);
    db('ugm3').insert({
        co: parseFloat(leitura.co[0]),
        co2: parseFloat(leitura.co2[1]),
        o3: parseFloat(leitura.o3[2]),
        no2: parseFloat(leitura.no2[3]),
        so2: parseFloat(leitura.so2[4]),
        tempo: new Date()  
    }).then(console.log);
   res.send("REQUISIÇÃO POST RECEBIDA");
});

app.listen(process.env.PORT || 3000, () => {
    console.log('ESPERANDO NA PORTA `${process.env.PORT}`');
});