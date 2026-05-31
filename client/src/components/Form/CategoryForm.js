import React from 'react'

const CategoryForm = ({ handleSubmit, value, setValue }) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    {/* FIX: added label linked via htmlFor */}
                    <label htmlFor="category-name" className="visually-hidden">Category name</label>
                    <input
                        id="category-name"
                        type="text"
                        className='form-control'
                        placeholder='Enter new category'
                        value={value}
                        onChange={(e) => setValue(e.target.value)} />
                </div>

                <button type="submit" className='btn btn-primary'>Submit</button>

            </form>
        </>
    )
}

export default CategoryForm;