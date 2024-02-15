import fs from "fs"
import ProductManager from "./productManagerFs.js"

const productManager = new ProductManager("./data/products.json")

//MANAGER ORIENTADO A FILE SYSTEM
export default class CartManager {
    constructor(path) {
        this.path = path
    }

    //CREAR CARRITO, funciona perfecto
    createCart = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8")
                const cartsArray = JSON.parse(data)
                let newCart = {
                    id: cartsArray.length + 1,
                    products: []
                }
                cartsArray.push(newCart)
                fs.promises.writeFile(this.path, JSON.stringify(cartsArray), null, "\t")
            } else {
                let newCartsArray = []
                let newCart = {
                    id: newCartsArray.length + 1,
                    products: []
                }
                newCartsArray.push(newCart)
                fs.promises.writeFile(this.path, JSON.stringify(newCartsArray), null, "\t")
            }
        } catch (error) { error.message }
    }

    //OBTENER CARRITO, funciona perfecto
    getCarts = async () => {
        const data = await fs.promises.readFile(this.path, "utf-8")
        const cartsArray = JSON.parse(data)
        return cartsArray
    }

    //OBTENER CARRITO POR ID, funciona perfecto
    getCartById = async (cartId) => {
        const data = await fs.promises.readFile(this.path, "utf-8")
        const cartsArray = JSON.parse(data)
        const foundCart = cartsArray.find(x => x.id === cartId)
        return foundCart
    }

    //AÑADIR PRODUCTO AL CARRITO, funciona perfecto
    addProductToCart = async (cartId, productId) => {

        //definiendo cartsArray and productsArray
        const cartData = await fs.promises.readFile(this.path, "utf-8")
        const cartsArray = JSON.parse(cartData)
        //encontrando el cart y el producto a agregar
        const foundCart = await this.getCartById(cartId)
        const foundProductInDb = await productManager.getProductById(productId)

        try {
            //validando la busqueda de cart y product
            if (foundCart && foundProductInDb) {
                //busca si el producto existe dentro del cart
                const productExistsInsideCart = await foundCart.products.find(x => x.id == productId)
                //valida la respuesta
                if (!productExistsInsideCart) {
                    //si no existe, crea y pushea un objeto con el pid y la cantidad
                    foundCart.products.push({ id: productId, quantity: 1 })
                } else {
                    //si existe, accede a la cantidad y la aumenta en 1
                    productExistsInsideCart.quantity += 1
                }
                //antes de reemplazar el cart nuevo al cartsArray de la db, busca el index y lo reemplaza con la info del cart nuevo
                const modifiedCartIndex = cartsArray.findIndex(x => x.id === cartId)
                cartsArray[modifiedCartIndex] = foundCart
                //con todo validado paso a paso, escribe la db con los datos nuevos
                fs.promises.writeFile(this.path, JSON.stringify(cartsArray), null, "\t")
            } else {
                console.log("addProductToCart failed, cart or product not found.")
            }
        } catch (error) { return error.message }
    }
}