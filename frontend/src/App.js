import React, { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x39167301e2F87b66C112726f1Ba5a5DB4B15a82c";

const abi = [
  "function assignRole(address user, uint8 role)",
  "function registerProduct(string,string)",
  "function transferProduct(uint,address)",
  "function markDelivered(uint)",
  "function getHistory(uint) view returns (tuple(address owner,uint8 status,uint256 timestamp)[])",
  "function productCount() view returns (uint256)",
  "function products(uint) view returns (uint id, string name, string description, address currentOwner, uint8 status)",
  "function roles(address) view returns (uint8)"
];

function App() {
  const [account, setAccount] = useState("");
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productId, setProductId] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [historyId, setHistoryId] = useState("");
  const [history, setHistory] = useState([]);
  const [roleAddress, setRoleAddress] = useState("");
  const [roleValue, setRoleValue] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected account:", accounts[0]);
    setAccount(accounts[0]);
  }

  async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);

    // FORCE switch to Amoy
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0x13882" } // 80002
    ]);

    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  }

  // async function getContract() {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const signer = await provider.getSigner();
  //   return new ethers.Contract(contractAddress, abi, signer);
  // }

  async function assignRole() {
    try {
      const contract = await getContract();
      const tx = await contract.assignRole(roleAddress, Number(roleValue));
      await tx.wait();
      alert("Role assigned successfully");
    } catch (error) {
      console.error("Assign role error:", error);
      alert(error?.reason || error?.shortMessage || error?.message || "Role assignment failed");
    }
  }

  async function registerProduct() {
    try {
      const contract = await getContract();
      const tx = await contract.registerProduct(productName, productDesc);
      await tx.wait();
      alert("Product registered successfully");
    } catch (error) {
      console.error(error);
      alert("Product registration failed");
    }
  }

  async function transferProduct() {
    try {
      const contract = await getContract();
      const tx = await contract.transferProduct(Number(productId), transferTo);
      await tx.wait();
      alert("Product transferred successfully");
    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    }
  }

  async function markDelivered() {
    try {
      const contract = await getContract();
      const tx = await contract.markDelivered(Number(productId));
      await tx.wait();
      alert("Product marked as delivered");
    } catch (error) {
      console.error(error);
      alert("Mark delivered failed");
    }
  }

  async function viewHistory() {
    try {
      const contract = await getContract();
      const result = await contract.getHistory(Number(historyId));
      setHistory(result);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch history");
    }
  }

  function getStatusText(status) {
    if (Number(status) === 0) return "Manufactured";
    if (Number(status) === 1) return "In Transit";
    if (Number(status) === 2) return "Delivered";
    return "Unknown";
  }

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Supply Chain DApp - ShifaYousaf</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={connectWallet}>Connect Wallet</button>
        <p>{account ? `Connected: ${account}` : "Wallet not connected"}</p>
      </div>

      <hr />

      <h2>Assign Role</h2>
      <input
        type="text"
        placeholder="Wallet Address"
        value={roleAddress}
        onChange={(e) => setRoleAddress(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <select
        value={roleValue}
        onChange={(e) => setRoleValue(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Select Role</option>
        <option value="1">Manufacturer</option>
        <option value="2">Distributor</option>
        <option value="3">Retailer</option>
        <option value="4">Customer</option>
      </select>
      <button onClick={assignRole}>Assign Role</button>

      <hr />

      <h2>Register Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Product Description"
        value={productDesc}
        onChange={(e) => setProductDesc(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={registerProduct}>Register Product</button>

      <hr />

      <h2>Transfer / Deliver Product</h2>
      <input
        type="number"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Transfer To Address"
        value={transferTo}
        onChange={(e) => setTransferTo(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={transferProduct} style={{ marginRight: "10px" }}>
        Transfer Product
      </button>
      <button onClick={markDelivered}>Mark Delivered</button>

      <hr />

      <h2>View Product History</h2>
      <input
        type="number"
        placeholder="Enter Product ID"
        value={historyId}
        onChange={(e) => setHistoryId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={viewHistory}>View History</button>

      <ul>
        {history.map((item, index) => (
          <li key={index}>
            Owner: {item.owner} | Status: {getStatusText(item.status)} | Time:{" "}
            {new Date(Number(item.timestamp) * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;