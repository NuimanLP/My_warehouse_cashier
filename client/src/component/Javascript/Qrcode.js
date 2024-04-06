import React from 'react';
import QrReader from 'react-qr-reader';

const QrCodeScanner = ({ onScanSuccess }) => {
    const handleScan = data => {
        if (data && typeof onScanSuccess === 'function') {
            onScanSuccess(data);
        } else {
            console.log('onScanSuccess prop is not a function');
        }
        };
      
    const handleError = err => {
         console.error(err);
  }

  return (
    <div>
      <QrReader
        delay={1}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QrCodeScanner;
