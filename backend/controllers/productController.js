



import productModel from '../models/productModel.js'
import orderModel from '../models/orderModel.js'
import categoryModel from '../models/categoryModel.js'
import fs from 'fs'
import slugify from 'slugify'
import braintree from 'braintree'
import dotenv from "dotenv"
dotenv.config();

// Payment gateway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// ─── Create Product ───────────────────────────────────────────────────────────
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo should be less than 1MB" });
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating product",
            error,
        });
    }
};


// ─── Get All Products ─────────────────────────────────────────────────────────
export const getProductController = async (_req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products fetched",
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting products",
            error: error.message,
        });
    }
};


// ─── Get Single Product ───────────────────────────────────────────────────────
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Product fetched successfully",
            product,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting product",
            error,
        });
    }
};


// ─── Get Product Photo ────────────────────────────────────────────────────────
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        if (product?.photo?.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }

        return res.status(404).send({
            success: false,
            message: "Photo not found",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting product photo",
            error,
        });
    }
};


// ─── Delete Product ───────────────────────────────────────────────────────────
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel
            .findByIdAndDelete(req.params.pid)
            .select("-photo");

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting product",
            error,
        });
    }
};


// ─── Update Product ───────────────────────────────────────────────────────────
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo should be less than 1MB" });
        }

        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating product",
            error,
        });
    }
};


// ─── Filter Products (With Pagination) ───────────────────────────────────────
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio, page = 1 } = req.body;
        const perPage = 8;

        let args = {};

        // Guard against null/undefined
        if (checked && checked.length > 0) {
            args.category = checked;
        }

        if (radio && radio.length === 2) {
            args.price = { $gte: radio[0], $lte: radio[1] };
        }

        // Total count of filtered results for Load More visibility
        const total = await productModel.countDocuments(args);

        // Paginated filtered results
        const products = await productModel
            .find(args)
            .select("-photo")
            .skip((parseInt(page) - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            total,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error filtering products",
            error,
        });
    }
};


// ─── Product Count ────────────────────────────────────────────────────────────
export const productCount = async (_req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();

        res.status(200).send({
            success: true,
            total,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting product count",
            error,
        });
    }
};


// ─── Product List (Paginated) ─────────────────────────────────────────────────
export const productListController = async (req, res) => {
    try {
        const perPage = 8;
        const page = req.params.page ? parseInt(req.params.page) : 1;

        const products = await productModel
            .find({})
            .select("-photo")
            .populate("category")        
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting product list",
            error,
        });
    }
};


// ─── Search Products ──────────────────────────────────────────────────────────
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;

        if (!keyword || keyword.trim() === "") {
            return res.status(400).send({
                success: false,
                message: "Search keyword is required",
            });
        }

        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).select("-photo")
            .populate("category");   

        res.status(200).json({
            success: true,
            results,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error searching products",
            error,
        });
    }
};


// ─── Related Products ─────────────────────────────────────────────────────────
// export const relatedProductController = async (req, res) => {
//     try {
//         const { pid, cid } = req.params;

//         const products = await productModel.find({
//             category: cid,
//             _id: { $ne: pid },
//         })
//             .select("-photo")
//             .limit(10)
//             .populate("category");

//         res.status(200).send({
//             success: true,
//             products,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error getting related products",
//             error,
//         });
//     }
// };


// ─── Related Products (with pagination) ──────────────────────────────────────
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;

        // Pagination — ?page=1&limit=10  (defaults to page 1, limit 10)
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const filter = { category: cid, _id: { $ne: pid } };

        // Run count + paginated fetch in parallel
        const [total, products] = await Promise.all([
            productModel.countDocuments(filter),
            productModel
                .find(filter)
                .select("-photo")
                .skip(skip)
                .limit(limit)
                .populate("category"),
        ]);

        res.status(200).send({
            success: true,
            total,          // <-- total count so frontend can build pagination
            page,
            limit,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting related products",
            error,
        });
    }
};

// ─── Products By Category ─────────────────────────────────────────────────────
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }

        const products = await productModel
            .find({ category })
            .populate("category")
            .select("-photo");

        res.status(200).send({
            success: true,
            category,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting products by category",
            error,
        });
    }
};


// ─── Braintree Token ──────────────────────────────────────────────────────────
export const braintreeTokenController = async (_req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error generating token",
                    error: err,
                });
            }
            res.status(200).send(response);
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Token generation failed",
            error,
        });
    }
};


// ─── Braintree Payment ────────────────────────────────────────────────────────
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;

        if (!cart || !nonce) {
            return res.status(400).send({
                success: false,
                message: "Cart and payment nonce are required",
            });
        }

        // // Use reduce for summing total
        // const total = cart.reduce((acc, item) => acc + item.price, 0);

        // ✅ Multiply price × cartQty for correct total
        const total = cart.reduce((acc, item) => {
            return acc + (item.price * (item.cartQty ?? 1));
        }, 0);

        gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: { submitForSettlement: true },
            },
            async function (error, result) {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: "Payment failed",
                        error,
                    });
                }

                if (result.success) {
                    // Properly awaited
                    await new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();

                    res.status(200).json({ ok: true });
                } else {
                    res.status(500).send({
                        success: false,
                        message: "Transaction unsuccessful",
                        result,
                    });
                }
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Payment processing error",
            error,
        });
    }
};