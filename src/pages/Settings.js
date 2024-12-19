import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Settings = () => {
  const [storeName, setStoreName] = useState("");

  const handleUpdateSettings = async () => {
    const settingsRef = doc(db, "settings", "storeInfo");
    await updateDoc(settingsRef, {
      name: storeName,
    });
    alert("Store name updated!");
  };

  return (
    <div>
      <h2>Settings</h2>
      <input
        type="text"
        placeholder="Store Name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      />
      <button onClick={handleUpdateSettings}>Update Store Name</button>
    </div>
  );
};

export default Settings;
