const express = require('express');
const cors = require('cors');
const knex = require('knex');
const emitter = require('events').EventEmitter;
const eventEmitter = new emitter();

const app = express();


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    }
});

// const db = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       user : 'projeto',
//       password : '123d',
//       database : 'monitoramento-gases'
//     }
//   });


//MIDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//ROTASS

let now = {
    'co': [0, 0],
    'co2': [0, 0],
    'o3': [0, 0],
    'no2': [0, 0],
    'so2': [0, 0]
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
   for(let prop in leitura){
       if(leitura[prop][0] === null)
            leitura[prop][0] = 0;
        if(leitura[prop][1] === null)
            leitura[prop][1] = 0;
   }
   Object.assign(now, leitura);
    db('ppm').insert({
        co: leitura.co[0],
        co2: leitura.co2[0],
        o3: leitura.o3[0],
        no2: leitura.no2[0],
        so2: leitura.so2[0],
        data: new Date()
    }).then(x => {
        console.log(x.command, 'REALIZADO NA TABELA ppm');
    });
    db('ugm3').insert({
        co: parseFloat(leitura.co[1]),
        co2: parseFloat(leitura.co2[1]),
        o3: parseFloat(leitura.o3[1]),
        no2: parseFloat(leitura.no2[1]),
        so2: parseFloat(leitura.so2[1]),
        data: new Date()  
    }).then(x => {
        console.log(x.command, 'REALIZADO NA TABELA ugm3');
    });
   eventEmitter.emit('novo_post', 'novo_post');
   res.send("REQUISIÇÃO POST RECEBIDA");
});

let ans = {
    'co' : ['x', 'y', 'z', 'j', 'k', 'l'],
    'co2' : ['x', 'y', 'z','j', 'k', 'l'],
    'o3' : ['x', 'y', 'z','j', 'k', 'l'],
    'no2' : ['x', 'y', 'z','j', 'k', 'l'],
    'so2' : ['x', 'y', 'z', 'j', 'k', 'l']
}

app.get('/minmaxmed', async function(req, res){
     for(k in ans){
        const minimo_ppm = await db('ppm').min(`${k} as x`).first();
        const maximo_ppm = await db('ppm').max(`${k} as x`).first();
        const media_ppm = await db('ppm').avg(`${k} as x`).first();
        const minimo_ugm3 = await db('ugm3').min(`${k} as x`).first();
        const maximo_ugm3 = await db('ugm3').max(`${k} as x`).first();
        const media_ugm3 = await db('ugm3').avg(`${k} as x`).first();  
        ans[k][0] = minimo_ppm.x; 
        ans[k][1] = maximo_ppm.x;
        ans[k][2] = media_ppm.x;
        ans[k][3] = minimo_ugm3.x; 
        ans[k][4] = maximo_ugm3.x;
        ans[k][5] = media_ugm3.x;
    }
    for(let prop in ans){
        if(ans[prop][0] === null)
            ans[prop][0] = 0;
        if(ans[prop][1] === null)
            ans[prop][1] = 0;
            if(ans[prop][2] === null)
            ans[prop][2] = 0;
        if(ans[prop][3] === null)
            ans[prop][3] = 0;
            if(ans[prop][4] === null)
            ans[prop][4] = 0;
        if(ans[prop][5] === null)
            ans[prop][5] = 0;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    // res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Type","text/event-stream");
    console.log("CONEXAO INICIADA SOURCE 2"); 
    function listener_min_max_med(event){
        console.log('Nova informação postada! --> Evento:', event, 'SOURCE 2');
        res.write("data: " + JSON.stringify(ans) + "\n\n");
    };
    eventEmitter.addListener('novo_post', listener_min_max_med);
    req.on('close', () => {
        eventEmitter.removeListener('novo_post', listener_min_max_med);
        console.log("CONEXAO FINALIZADA SOURCE 2")
    })
    //os 3 primeiros sao valores em ppm do gas e os 3 ultimos sao os valores em ugm3
});

app.get('/startsend', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    // res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Type","text/event-stream");
    console.log("CONEXAO INICIADA SOURCE 1");
    function listener_post_dados(event) {
        console.log('Nova informação postada! --> Evento:', event, 'SOURCE 1');
        res.write("data: " + JSON.stringify(now) + "\n\n");
    };
    eventEmitter.addListener('novo_post', listener_post_dados);
    req.on('close', () => {
        eventEmitter.removeListener('novo_post', listener_post_dados);
        console.log("CONEXAO FINALIZADA SOURCE 1")
    })
});

app.listen(process.env.PORT || 3000, () => {
    console.log('ESPERANDO NA PORTA ${process.env.PORT || 3000}');
});