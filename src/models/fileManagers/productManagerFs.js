import fs from "fs"

//MANAGER HECHO ORIENTADO A FILE SYSTEM
export default class ProductManager {

    constructor(path) {
        this.path = path
    }
    //OBTENER PRODUCTOS (GET)
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                // console.log("get products desde productmanager.js")
                let data = await fs.promises.readFile(this.path, "utf-8")
                const productsObj = JSON.parse(data)
                // console.log("GET PRODUCTS: ")
                // console.log(productsObj)
                return productsObj
            }
        } catch (error) { console.log(`GetProduct in manager failed, error is ${error.message}`) }

    }

    //VALIDACION DE TIPO DE DATOS, funciona perfecto (deberian estar en el router)
    async checkProductValues(thisProduct) {
        //funcion para validar strings
        async function isString(value) {
            return typeof value === 'string';
        }
        //funcion para validar number
        async function isNumber(value) {
            return typeof value === 'number';
        }

        const data = await fs.promises.readFile(this.path, "utf-8")
        const productsObj = JSON.parse(data)

        try {
            //primer validacion, existencia de propiedades y tipo de dato de las mismas
            if (await isString(thisProduct.title) === true &&
                await isString(thisProduct.description) === true &&
                await isNumber(thisProduct.price) === true &&
                await isString(thisProduct.thumbnail) == true &&
                await isString(thisProduct.category) === true &&
                await isString(thisProduct.code) === true &&
                await isNumber(thisProduct.stock) === true) {
                // console.log("Manager checkProductValues, primer validacion (existencia y tipo de datos) Ok.")
                return true
            } else {
                console.log("Manager checkProductValues, primer validacion (existencia y tipo de datos) fallida.")
                return false
            }

        } catch (error) {
            console.log(`Manager CheckValues failed, ${error.message}`)
        }
    }
    //AÑADIR PRODUCTO (GET),funciona perfecto
    async addProduct(newProduct) {

        const productsObj = await this.getProducts()

        try {
            if (fs.existsSync(this.path)) {
                if (await this.checkProductValues(newProduct) === true) {
                    //segunda validacion, existencia en base de datos segun la propiedad code, funciona perfecto
                    let codeCheckIfFound = productsObj.some(x => x.code === newProduct.code)
                    if (codeCheckIfFound == true) {
                        // console.log("Manager AddProduct fallada. (el producto ya existe en la base de datos) ")
                        return { status: "Failed", message: `AddProduct in manager failed, product already in database.` }
                    } else {
                        // console.log(`Manager ADD PRODUCT: New product info is valid, ${newProduct.title} added to db.`)
                        newProduct.id = productsObj.length + 1
                        productsObj.push(newProduct)
                        await fs.promises.writeFile(this.path, JSON.stringify(productsObj), null, "\t")
                        return { status: `Ok`, message: `AddProduct in manager Success.` }
                        // console.log("Manager checkProductValues, segunda validacion Ok. (el producto no existe en la base de datos) ")
                    }

                } else {
                    // console.log("AddProduct in manager, failed validation.")
                    return { status: "Failed", message: `AddProduct in manager failed, check values of properties.` }
                }
            } else {
                // console.log("AddProduct in manager failed, database not found, check path.")
                return { status: "Failed", message: `AddProduct in manager failed, database doesn't exist, check path, ${this.path}` }
            }
        } catch (error) {
            console.log(`AddProduct in manager failed, error is ${error.message}`)
            return { status: `Failed`, message: `AddProduct in manager failed, error is ${error.message}.` }
        }
    }

    //OBBTENER PRODUCTO POR ID (GET), funciona perfecto
    async getProductById(thisId) {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8")
            const productsObj = JSON.parse(data)
            let foundId = productsObj.find(x => x.id === thisId)
            // console.log(`GET PRODUCT BY ID: Searching for this id: ${thisId}, found product by Id is: ${foundId.title} + ${foundId.description}`)
            if (foundId) {
                return foundId
            } else {
                // console.log("Producto NO ENCONTRADO.")
            }
        } catch (error) { console.log(`GPI error is ${error.message}`) }
    }

    //ACTUALIZAR PRODUCTO (PUT), funciona perfecto
    async updateProduct(thisProduct) {
        try {
            const productsObj = await this.getProducts()
            let foundProduct = productsObj.find(x => x.id === thisProduct.id)

            if (foundProduct) {
                //estas validaciones podrian ser reemplazadas por checkValues, pero primero resolver checkValues.
                if (await this.checkProductValues(thisProduct) === true) {
                    console.log(`UPDATE PRODUCT: Updating ${foundProduct.title + " " + foundProduct.description} with new values.`)
                    const foundIndex = productsObj.findIndex(x => x.id === thisProduct.id)
                    productsObj[foundIndex] = thisProduct
                    // console.log(thisProduct)
                    await fs.promises.writeFile(this.path, JSON.stringify(productsObj), null, "\t")
                    return { status: "Ok", message: "Update Product from manager successfull." }
                } else {
                    console.log("Update Product from manager failed, check values.")
                    return { status: "Failed", message: "Update Product from manager failed, check product values." }
                }
            } else {
                // console.log("UPDATE PRODUCT: Product not found in DB.")
                return { status: "Failed", message: "Update Product from manager, product not found in database." }
            }
        } catch (error) { console.log(`UpdateProduct in manager failed, error is ${error.message}`) }
    }

    //ELIMINAR PRODUCTO (DELETE), funciona perfecto
    async deleteProduct(thisId) {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8")
            const productsObj = JSON.parse(data)
            const foundIndex = productsObj.findIndex(x => x.id === thisId)

            if (foundIndex >= 0) {
                // console.log(`DELETE PRODUCT: Deleting ${productsObj[foundIndex].title}.`)
                productsObj.splice(foundIndex, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(productsObj), null, "\t")
            } else {
                console.log(`DELETE PRODUCT: Product not found.`)
            }
        } catch (error) { console.log(`DeleteProduct in manager failed, error is ${error.message}`) }
    }
}


