import { Router } from 'express'
import CartsController from '../controllers/carts.controller.js'

const router = Router()

router.get('/', CartsController.getAll)
router.post('/', CartsController.createCart)
router.get('/:cid', CartsController.getCartById)
router.put('/:cid', CartsController.replaceProducts)
router.delete('/:cid', CartsController.emptyCart)
router.post('/:cid/products/:pid', CartsController.addToCart)
router.put('/:cid/products/:pid', CartsController.updateQuantity)
router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart)



export default router