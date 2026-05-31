import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [photo, setPhoto] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")

    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/get-category');
            if (data?.success) {
                setCategories(data?.category);
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Something went wrong in getting category ")
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData()
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("quantity", quantity)
            productData.append("photo", photo)
            productData.append("category", category)

            const { data } = axios.post('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/create-product', productData)

            if (data?.success) {
                toast.error(data?.message)
            } else {
                toast.success('Product Created Successfully ')
                navigate('/dashboard/admin/products')
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Something Went wrong ')
        }
    }

    return (
        <Layout title={"Dashboard- Create Product"}>
            <div className="container-fluid p-3">
                <div className="row mx-3">
                    <div className="col-lg-3 col-md-4 mx-lg-4">
                        <AdminMenu />
                    </div>
                    <div className="col-lg-6 col-md-8 ">
                        <h1 className='mb-4 mx-4 mx-lg-0 mt-4 mt-sm-0'>Create Product</h1>
                        <div className="w-100 ">
                            {/* FIX: aria-label on Select (Ant Design doesn't support htmlFor) */}
                            <label htmlFor="cp-category" className="visually-hidden">Select a category</label>
                            <Select
                                id="cp-category"
                                variant={false}
                                placeholder="Select a Category"
                                size="large"
                                showSearch
                                className='form-select mb-3'
                                onChange={(value) => { setCategory(value) }}
                                aria-label="Select a category"
                            >
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-100 mb-3">
                            <label className='btn btn-outline-secondary'>
                                {photo ? photo.name : "Upload Photo"}
                                {/* FIX: hidden file input — label acts as its accessible name */}
                                <input type="file" name="photo" accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                            </label>
                        </div>
                        <div className="w-100 mb-3">
                            {photo && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(photo)} alt='product photo preview' height={"200px"} className='img img-responsive' />
                                </div>
                            )}
                        </div>
                        {/* FIX: added labels for all inputs */}
                        <div className="w-100 mb-3">
                            <label htmlFor="cp-name" className="visually-hidden">Product name</label>
                            <input
                                id="cp-name"
                                type="text"
                                value={name}
                                placeholder='Write a name'
                                className='form-control'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="w-100 mb-3">
                            <label htmlFor="cp-description" className="visually-hidden">Product description</label>
                            <textarea
                                id="cp-description"
                                value={description}
                                placeholder="Write a description"
                                className="form-control"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="w-100 mb-3">
                            <label htmlFor="cp-price" className="visually-hidden">Price</label>
                            <input
                                id="cp-price"
                                type="number"
                                value={price}
                                placeholder="Write a price"
                                className="form-control"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="w-100 mb-3">
                            <label htmlFor="cp-quantity" className="visually-hidden">Quantity</label>
                            <input
                                id="cp-quantity"
                                type="number"
                                value={quantity}
                                placeholder="Write a quantity"
                                className="form-control"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="w-100 mb-3">
                            <Select
                                variant={false}
                                placeholder="Select Shipping"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => { setShipping(value); }}
                                aria-label="Select shipping option"
                            >
                                <Option value="0">No</Option>
                                <Option value="1">Yes</Option>
                            </Select>
                        </div>
                        <div className="w-100 mb-3">
                            <button className="btn btn-primary" onClick={handleCreate}>CREATE PRODUCT</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct