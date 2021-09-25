import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import btc_art from './images/bitcoin-art.jpg';
import waveportal from './utils/UpgradedPortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allSignatures, setAllSignatures] = useState([]);
  const [name, setName] = useState(null);
  const [message, setMessage] = useState(null);
  const contractAddress = "0xEDd040078A58Df2Ef5792F6b90FEb2860EFCa134";

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllSignatures = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress, waveportal.abi, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const signatures = await waveportalContract.getAllSignatures();
        
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let signaturesCleaned = [];
        signatures.forEach(signature => {
          signaturesCleaned.push({
            address: signature.signer,
            timestamp: new Date(signature.timestamp * 1000),
            message: signature.message,
            name: signature.name
          });
        });

        /*
         * Store our data in React State
         */
        setAllSignatures(signaturesCleaned);

        waveportalContract.on("NewSignature", (from, timestamp, message, name) => {
          console.log("NewSignature", from, timestamp, message, name);

          setAllSignatures(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
            name: name
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        console.log("im in bitch")
        getAllSignatures();
        console.log("im out yessir")
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

const sign = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress, waveportal.abi, signer);

        let count = await waveportalContract.getTotalSignatures();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */

        const waveTxn = await waveportalContract.sign(name, message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await waveportalContract.getTotalSignatures();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

function getName(evnt) {
  setName(evnt.target.value);
}
function getMessage(evnt) {
  setMessage(evnt.target.value);
}


useEffect(() => {
    checkIfWalletIsConnected();
}, [])
    
  return (
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
          👋 Hola! Welcome to my Yearbook
          </div>

          <div className="bio">
            My name is Daniel, I invite you to sign my yearbook and leave a message!
          </div>
          <br/>
          <img src={btc_art} alt="btcart" />
          <label>
          Name:
          </label>
          <input type="text" placeholder="..." onChange={getName}/>
          <br/>
          <label> Message: </label>
          <input type="text" placeholder="..." onChange={getMessage}/>

          <button className="waveButton" onClick={sign}>
            Sign my yearbook!
          </button>
          
          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allSignatures.map((signature, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {signature.address}</div>
              <div>Time: {signature.timestamp.toString()}</div>
              <div>Name: {signature.name}</div>
              <div>Message: {signature.message}</div>
            </div>)
        })}
        </div>
      </div>
    );
}

export default App