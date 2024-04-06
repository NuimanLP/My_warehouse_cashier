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
        const response = await axios.get(`${config.serverUrlPrefix}/products/getProductInfo`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log('Products response:', response.data);
        setProducts(response.data);
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
            <td>
              <img
                src={`${config.serverReceipt}${product.Shot.formats.small.url}`}
                alt={product.productName}
                style={{ width: '100px' }}
              />
            </td>            
            <td>{product.Branding} {product.Category} {product.Product_name}</td>
            <td>{product.Pricing}</td>
            <td>{product.Barcode}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Product;
