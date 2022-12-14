import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import ProductItem from "../utils/productsItem/ProductItem";
import Filters from "./Filters";
import LoadMore from "./LoadMore";

function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    if (window.confirm("Do you want to delete a product.")) {
      try {
        setLoading(true);
        // const destroyImg = axios.post('/api/destroy', { public_id }, {
        //     headers: { Authorization: token }
        // })

        const deleteProduct = axios.delete(`/api/products/${id}`, {
          headers: { Authorization: token },
        });
        // await destroyImg
        await deleteProduct;
        setLoading(false);
        setCallback(!callback);
      } catch (err) {
        alert(err.data.msg);
      }
    }
  };

  const deleteProductAll = async (id, public_id) => {
    try {
      setLoading(true);
      // const destroyImg = axios.post('/api/destroy', { public_id }, {
      //     headers: { Authorization: token }
      // })

      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      // await destroyImg
      await deleteProduct;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    if (window.confirm("Do you want to delete these products.")) {
      products.forEach((product) => {
        if (product.checked)
          deleteProductAll(product._id, product.images.public_id);
      });
      alert("Deleted success!");
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete</button>
        </div>
      )}
      <div className="products">
        {products?.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            setProducts={setProducts}
            isAdmin={isAdmin}
            deleteProduct={deleteProduct}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <LoadMore />
      {products?.length === 0 && <Loading />}
    </div>
  );
}

export default Products;
