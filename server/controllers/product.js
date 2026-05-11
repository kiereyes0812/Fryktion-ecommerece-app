//[SECTION] Activity: Dependencies and Modules
const Product = require("../models/Product");
const { errorHandler } = require('../auth');

//[SECTION] Activity: Create a product
/*
    Steps: 
    1. Instantiate a new object using the product model and the request body data
    2. Save the record in the database using the mongoose method "save"
    3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method
*/
module.exports.addProduct = (req, res) => {

    // Creates a variable "newproduct" and instantiates a new "product" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    //Check if a product with the same name already exists in the database.
    Product.findOne({ name: req.body.name })

    .then(existingProduct => {

        if (existingProduct) {
            //If a product with the same name exists, send a 409(conflict) status code to indicate that there is already a saved product with the provided name.
            return res.status(409).send({ message: 'Product already exists'})

        } else {

            // Saves the created object to our database
            return newProduct.save()
            /*
                Response Body: The respone body is a send object containing key-value pairs. 
            It can be: 

                - success: true - sending a boolean value of true that indicate that the product was added successfully

                - message: A descriptive message indicating that the product was added successfully as it provides clearer feedback to the client abount the outcome of their request


                - result: Additional details about the the newly created product. Including the result of the creation opeartion in response allows the client to immediately access information about the newly created resource.

            */
            .then(result => res.status(201).send({
                success: true,
                message: 'Product added successfully',
                result: result
            }))
            .catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res))
}; 


//[SECTION] Activity: Retrieve all products
module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(result => {
        // if the result is not null send status 30 and its result
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            // 404 for not found products
            return res.status(404).send({ message: 'No products found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active products
/*
    Steps: 
    1. Retrieve all products using the mongoose "find" method with the "isActive" field values equal to "true"
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllActive = (req, res) => {

    Product.find({ isActive : true }).then(result => {
        // if the result is not null
        if (result.length > 0){
            // send the result as a response
            return res.status(200).send(result);
        }
        // if there are no results found
        else {
            // send the message as the response
            return res.status(404).send({ message: 'No active products found'})
        }
    }).catch(err => res.status(500).send(err));

};

//[SECTION] Retrieve a specific product
/*
    Steps: 
    1. Retrieve a product using the mongoose "findById" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({ message: 'Product not found'});
        } 

            return res.status(200).send(product);
        
    })
    .catch(error => errorHandler(error, req, res)); 
};


module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    // findByIdandUpdate() finds the the document in the db and updates it automatically
    // req.body is used to retrieve data from the request body, commonly through form submission
    // req.params is used to retrieve data from the request parameters or the url
    // req.params.productId - the id used as the reference to find the document in the db retrieved from the url
    // updatedproduct - the updates to be made in the document
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(product => {
        if (product) {
            res.status(200).send({success: true, message: 'Product updated successfully'});
        } else {
            res.status(404).send({ message: 'Product not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveProduct = (req, res) => {
  
    let updateActiveField = {
        isActive: false
    };

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            // Check if a product was found
            if (product) {
                // If product found, check if it was already archived
                if (!product.isActive) {
                    // If product already archived, return a 200 status with a message indicating "Product already archived".
                    return res.status(200).send('Product already archived');
                }
                // If product not archived, return a 200 status with a boolean true.
                return res.status(200).send({success: true,
                    message: 'Product archived successfully'
                });
            } else {
                // If product not found, return a 404 status with a boolean false.
                return res.status(404).send({message: 'product not found'});
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {
  
    let updateActiveField = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            // Check if a product was found
            if (product) {
                // If product found, check if it was already activated
                if (product.isActive) {
                    // If product already activated, return a 200 status with a message indicating "product already activated".
                    return res.status(200).send({message: 'Product already activated',
                        product: product
                });
                }
                // If product not yet activated, return a 200 status with a boolean true.
                return res.status(200).send({success: true,
                    message: 'Product activated successfully'
                });
            } else {
                // If product not found, return a 404 status with a boolean false.
             return res.status(404).send({message: 'Product not found'});
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//add search for products by their names

// [SECTION] Search products by name
module.exports.searchByName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Product name is required" });
    }

    // Case-insensitive regex search
    const products = await Product.find({
      name: { $regex: name, $options: "i" }
    });

    if (products.length === 0) {
      return res.status(404).send({ message: "No products found with that name" });
    }

    res.status(200).send({
      message: "Products found",
      results: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};


//Range

module.exports.searchByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body; //

    if (minPrice === undefined || maxPrice === undefined) {
      return res.status(400).send({
        message: "minPrice and maxPrice are required"
      });
    }

    // Query products within price range
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });

    if (products.length === 0) {
      return res.status(404).send({ message: "No product found in this price range" });
    }

    // (c) return array of products
    res.status(200).send({
      message: "products found",
      results: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};