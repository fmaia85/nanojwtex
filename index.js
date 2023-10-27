// Necessarias as bibliotecas:
// npm i express
// npm i jsonwebtoken dotenv-safe

// Baseado no exemplo visto em:
// https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/

const express = require('express'); 
const app = express(); 

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
 
app.use(express.json());

function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}
 
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 
app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'luiz'}]);
})

//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luiz' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})


app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

 
app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));