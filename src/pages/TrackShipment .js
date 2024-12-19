import React, { useState } from 'react';

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentStatus, setShipmentStatus] = useState('');

  const handleTrack = () => {
    // هنا يمكن إرسال التتبع باستخدام الرقم وتحديث الحالة
    setShipmentStatus('Shipment is in transit...');
  };

  return (
    <div className="track-shipment">
      <h1>Track Your Shipment</h1>
      <input 
        type="text" 
        placeholder="Enter Tracking Number" 
        value={trackingNumber} 
        onChange={(e) => setTrackingNumber(e.target.value)} 
      />
      <button onClick={handleTrack}>Track</button>
      {shipmentStatus && <p>{shipmentStatus}</p>}
    </div>
  );
};

export default TrackShipment;
