import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import config from '../../config';

function Product() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Check for JWT token in sessionStorage
      if (!sessionStorage.getItem('jwt')) {
        throw new Error('No JWT token found');
      }
      const jwt = sessionStorage.getItem('jwt');

      try {
        const response = await axios.get(`${config.serverUrlPrefix}/products?populate=*`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log('Products response:', response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    
    <Table striped bordered hover size="sm">
      <thead>
        <h1>Product List</h1>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Product Name</th>
          <th>Pricing</th>
          <th>Barcode</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id}>
            <td>{index + 1}</td>
            <td><img src = {product.attributes.Shot.data.attributes.formats.small.url}/></td>
            <td>{product.attributes.Branding} {product.attributes.Category} {product.attributes.Product_name}</td>
            <td>{product.attributes.Pricing}</td>
            <td>{product.attributes.Barcode}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Product;
