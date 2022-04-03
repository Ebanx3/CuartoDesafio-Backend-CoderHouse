const express = require('express');
const router = express.Router();

const fs = require('fs');


class Contenedor {
    constructor(path) {
        this.contenedor = [];
        this.path = path;
    }


    save(obj) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }
        obj.ID = this.contenedor.length + 1;
        this.contenedor.push(obj);

        const data = JSON.stringify(this.contenedor);

        try {
            fs.writeFileSync(this.path, data);
        }
        catch (err) {
            console.log('Error de escritura', err.message);
        }
        return obj.ID;
    }

    getById(num) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }


        const valor = this.contenedor.findIndex(element => {
            return element.ID == num
        })
        if (valor < 0)
            return null
        else{
            
            return this.contenedor[valor];
        }
    }

    getAll() {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }
        return this.contenedor;
    }

    deleteById(num) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }

        const valor = this.contenedor.findIndex(element => {
            return element.ID == num
        })

        if (valor >= 0) {
            this.contenedor.splice(valor, 1);
            const data = JSON.stringify(this.contenedor);
            fs.writeFileSync(this.path,data)
        }
    }

    deleteAll() {
        try {
            fs.unlinkSync(this.path);
            this.contenedor.splice(0, this.contenedor.length);
        }
        catch (err) {
            console.log('Error borrando el archivo', err.message);
        }
    }

}

router.get('/',(req,res)=>{
    const contenedor = new Contenedor('contenedor.txt');
    contenedor.getAll();
    if (contenedor.length == 0){
        return res.status(400).json({error: 'Contenedor sin elementos'});
    }

    res.json({
        Productos:contenedor.contenedor
    })
});

router.get('/:id',(req,res)=>{
    const idBuscado = req.params.id;
    const contenedor = new Contenedor('contenedor.txt');
    const producto = contenedor.getById(idBuscado);
    if (producto == null){
        return res.status(400).json({
            error:'Producto no encontrado'
        });
    }

    res.status(200).json({
        Producto:producto
    })
});

router.post('/', (req,res)=>{
    const body = req.body;
    console.log(body);

    body.precio=parseInt(body.precio)
    console.log(body);
    const contenedor = new Contenedor('contenedor.txt');
    if (!body.nombre || !body.precio || !body.thumbnail || typeof body.nombre != 'string' || isNaN(body.precio) || typeof body.thumbnail != 'string'){
        return res.status(400).json({
            error: 'Debes ingresar un nombre(string), precio(number) y thumbnail(string) para el producto'
        });
    }
    contenedor.save(body);
    res.status(200).json({
        ProductoAgregado: body
    })
});

router.put('/:id',(req,res)=>{
    const idBuscado = req.params.id;
    const body = req.body;
    const contenedor = new Contenedor('contenedor.txt');

    const producto = contenedor.getById(idBuscado);

    if(producto == null){
        return res.status(400).json({
            error: 'No existe producto con el id buscado'
        })
    }

    if(!body.nombre || !body.precio || !body.thumbnail || typeof body.nombre != 'string' || typeof body.precio != 'number' || typeof body.thumbnail != 'string'){
        return res.status(400).json({
            error: 'Debes ingresar un nombre(string), precio(number) y thumbnail(string) para el producto'
        });
    }

    const productoAnterior = {
        nombre:producto.nombre,
        precio:producto.precio,
        thumbnail:producto.thumbnail
    }

    producto.nombre = body.nombre;
    producto.precio = body.precio;
    producto.thumbnail = body.thumbnail;

    const data = JSON.stringify(contenedor.contenedor);
    fs.writeFileSync('contenedor.txt', data);

    res.status(200).json({
        Id: idBuscado,
        ProductoAnterior:productoAnterior,
        NuevosValores:body
    })

});

router.delete('/:id',(req,res)=>{
    const idBuscado = req.params.id;
    const contenedor = new Contenedor('contenedor.txt');

    const cont = contenedor.getAll();
    console.log(cont)
    if (idBuscado > cont.length){
        return res.status(400).json({
            error: 'No existe un producto con el id'
        });
    }
    contenedor.deleteById(idBuscado);
    
    res.json({
        msg: `Elemento con id ${idBuscado} borrado`
    })
});

module.exports = router;