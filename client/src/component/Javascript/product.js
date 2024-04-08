import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import '../CSS/product.css';
import QrCodeScanner from './Qrcode.js';

function Product() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStockQuantity, setSelectedStockQuantity] = useState(null);

  const handleEdit = (product) => {
    setSelectedBranding(product);
    setSelectedProduct(product);
    setSelectedPricing(product);
    setSelectedBarcode(product);
    setSelectedImage(product);
    setSelectedStockQuantity(product);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBranding(null);
    setSelectedProduct(null);
    setSelectedPricing(null);
    setSelectedBarcode(null);
    setSelectedImage(null);
    setSelectedStockQuantity(null);
  };

  useEffect(() => {
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
                defaultValue={selectedProduct?.Product_name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, Product_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Branding</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedBranding?.Branding}
                onChange={(e) => setSelectedBranding({ ...selectedBranding, Branding: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pricing</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPricing?.Pricing}
                onChange={(e) => setSelectedPricing({ ...selectedPricing, Pricing: e.target.value })}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedStockQuantity?.StockQuantity}
                onChange={(e) => setSelectedStockQuantity({ ...selectedStockQuantity, StockQuantity: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="image"
                defaultValue={selectedImage?.Image}
                onChange={(e) => setSelectedImage({ ...selectedImage, Image: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedBarcode?.Barcode}
                onChange={(e) => setSelectedBarcode({ ...selectedBarcode, Barcode: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => {
            need implment
            handleClose();
          }}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Product;
