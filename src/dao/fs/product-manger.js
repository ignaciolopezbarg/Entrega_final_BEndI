class ProductManager{
    static lastId = 0;
    //variable estatica que almacena el ultimo id generado
    constructor(){
        
        this.products = [];
    }
    // Primer metodo para crear product, con todos los campos y que no repita el code
    addProduct (title,description,code,price,stock,img){
        if( !title || !description || !code || !price ||!stock || !img ){
            console.log('todos los campos se requieres');
            return;
        }
        if(this.products.some(item => item.code === code)){
            console.log('no se puede tener codigos iguales')
            return;
        }
        //nueva instancia del constructor
        const nuevoProducto ={
            id: ++ProductManager.lastId,
            title,
            description,
            code,
            stock,
            price,
            img
        }
        //ahora agrego el nuevo producto al array vacio
        this.products.push(nuevoProducto);
    }
    //Creo el metodo para obtener los productos
    getProducts(){
        return this.products;
    }
    //Creo metodo para obtener producto por id
    getProductbyId(id){
        const producto = this.products.find(item =>item.id === id);
        if(producto){
            console.log('producto encontrado :', producto)
        } else {
            console.log('product not found')
        }
    }
}
//Testing de los metodos con node.js
// creo una instancia del constructor y la llamo manager
const manager = new ProductManager();
// si ahora lo quiero ver me debe dar un array vacio
console.log(manager.getProducts());
//creo una instancia del manager
manager.addProduct('fideos', 'tirabuzon', 'FT1', 1500, 25, 'sinimagen');
console.log(manager.getProducts());
//busco un producto por Id
//manager.getProductbyId(1);
// manager.addProduct('harina','tres ceros', 'HA3', 900, 100, 'sin imagen');
// console.log(manager.getProducts());
// console.log(manager.getProductbyId(2))

manager.addProduct('arroz', 'yamani', 'FT1', 150, 25, 'sinimagen')
console.log(manager.getProducts)

