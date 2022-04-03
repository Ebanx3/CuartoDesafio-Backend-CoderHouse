//Cuarto desafío entregable - Curso Backend - Esteban dos Santos Mello
//API RESTful
const express = require('express');
const app = express();
const router = require('./routes/index');
const path = require('path');
const port = 8080;
app.listen(port,()=>{
    console.log('Server ready, listening at port',port);
});
app.on('error',(err)=>{
    console.log('Server interrupted',err);
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const publicFolderPath = path.resolve(__dirname,'./views');
app.use(express.static(publicFolderPath))

app.use('/api/productos',router);