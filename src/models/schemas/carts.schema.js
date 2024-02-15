import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { Schema, model } from 'mongoose'

const collectionName = 'carts'

const cartSchema = mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            quantity: { type: Number, required: true },
        }
    ]
})

//middleware, a partir de ahora, el .find en este modelo, devolvera el documento con la info del populate
cartSchema.pre('find', function () { this.populate('products.product') })
cartSchema.pre('findOne', function () { this.populate('products.product') })

//le agregamos el plugin al esquema
cartSchema.plugin(paginate)

//.model(nombre de la coleccion, esquema de los documentos)
const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel