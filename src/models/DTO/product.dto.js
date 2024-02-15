import { generateNewCode } from '../../utils/utils.js'

export default class ProductsDTO {
    constructor(product) {
        if (!this.isValidProduct(product)) {
            throw new Error('Invalid product data.');
        }

        this.title = product.title;
        this.description = product.description;
        this.category = product.category;
        this.code = generateNewCode()
        this.price = product.price;
        this.stock = product.stock;
        this.thumbnail = product.thumbnail;
        this.owner = product.owner
    }

    isValidProduct(product) {
        return (
            product &&
            typeof product.title === 'string' &&
            typeof product.description === 'string' &&
            typeof product.category === 'string' &&
            typeof product.price === 'number' &&
            typeof product.stock === 'number' &&
            typeof product.thumbnail === 'string' &&
            typeof product.owner === 'string'
        );
    }
}

// DTO (Data Transfer Object):
// A DTO is an object that carries data between processes, usually between the application and the database or between different
// parts of an application. It's used to encapsulate data and transport it efficiently between different layers or modules.
// In your Node.js ecommerce project, you might use DTOs to transfer data between your frontend and backend or between different
// parts of your server.Example: Let's say you're fetching product information from your database. You could create a ProductDTO
// that includes only the necessary fields like name, price, and description. This way, you're sending only the required data
// between your server and frontend.