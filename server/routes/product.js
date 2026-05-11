//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");

const auth = require("../auth");

const { verify, verifyAdmin } = require("../auth");

//[SECTION] Activity: Routing Component
const router = express.Router();

//[SECTION] Activity: Route for creating a product
router.post("/", verify, verifyAdmin, productController.addProduct); 

//[SECTION] Activity: Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//[SECTION] Activity: Route for retrieving all active products
router.get("/active", productController.getAllActive);

//[SECTION] Activity: Route for retrieving a specific product
router.get("/:productId", verify, productController.getProduct);

//[SECTION] Route for updating a product (Admin)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//[SECTION] Activity: Route to archiving a product (Admin)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//[SECTION] Activity: Route to activating a product (Admin)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//Price Range
router.post("/search-by-price", productController.searchByPriceRange);

router.post("/search-by-name", productController.searchByName);



//[SECTION] Activity: Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;