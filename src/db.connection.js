import mongoose from "mongoose";
// mongoose.connect("mongodb+srv://IgnacioLopezBarg:Miramar1730@cluster0.zntudjy.mongodb.net/ecommerce2?retryWrites=true&w=majority&appName=Cluster0")

mongoose.connect("mongodb+srv://nacho:holanacho@cluster0.g6mfb4u.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")

.then(()=>console.log('conexion a la Bd exitosa'))
.catch((error)=> console.log('no se pudo conectar a la bd',error))