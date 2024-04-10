import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import '../CSS/product.css';
import QrCodeScanner from './Qrcode.js';

function Product() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    Product_name: '',
    Branding: '',
    StockQuantity: '',
    Pricing: '',
    Barcode: '',
    Image: '',
  });

  const handleEdit = (product) => {
    setSelectedProduct({
      id: product.id,
      Product_name: product.Product_name,
      Branding: product.Branding,
      StockQuantity: product.StockQuantity,
      Pricing: product.Pricing,
      Barcode: product.Barcode,
      ImageUrl: product.Shot.formats.small.url
    });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const fetchProducts = async () => {
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

  const handleSaveChanges = async () => {
    if (!selectedProduct.id) {
      console.error("No product selected for update");
      return;
    }

    try {
      const response = await axios.put(`${config.serverUrlPrefix}/products/${selectedProduct.id}`, {
        data: {
          Product_name: selectedProduct.Product_name,
          Branding: selectedProduct.Branding,
          StockQuantity: selectedProduct.StockQuantity,
          Pricing: selectedProduct.Pricing,
          Barcode: selectedProduct.Barcode,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
      });

      console.log("Product updated successfully:", response.data);
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Table striped bordered hover size="sm" className='table-custom'>
        <thead>
          <h1>Product List</h1>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Pricing</th>
            <th>Barcode</th>
            <th>EditSec</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td style={{ width: '20px' }}>{index + 1}</td>
              <td>
                <img
                  src={`${config.serverReceipt}${product.Shot?.formats?.small?.url ?? ''}`}
                  alt={product.productName}
                  style={{ width: '150px' }}
                />
              </td>
              <td>[{product.Branding}] {product.Category} {product.Product_name}</td>
              <td>{product.StockQuantity} ชิ้น</td>
              <td>{product.Pricing} บาท</td>
              <td>{product.Barcode}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(product)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>


      {/* Modal for editing product details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                // name = 'Product_name'
                value={selectedProduct?.Product_name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Product_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Branding</Form.Label>
              <Form.Control
                type="text"
                // name = 'Branding'
                value={selectedProduct?.Branding}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Branding: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pricing</Form.Label>
              <Form.Control
                type="text"
                // name = 'Pricing'
                value={selectedProduct?.Pricing}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Pricing: e.target.value })}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={selectedProduct?.StockQuantity}
                onChange={(e) => {
                  // Parse integer (value,10) 10 == NumberBase ฐาน10
                  const value = parseInt(e.target.value, 10); 

                  // If value is NaN,setStockQuan = '' else Max quantity = 0
                  setSelectedProduct({...selectedProduct,StockQuantity: isNaN(value) ? '' : Math.max(0, value)
                  });
                }}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                // name = 'Image'
                value={selectedProduct?.Image}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Image: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                // name = 'Barcode'
                value={selectedProduct?.Barcode}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Barcode: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => {
            handleClose();
          }}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Product;
