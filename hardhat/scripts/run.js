async function main() {
    const waveContractFactory = await hre.ethers.getContractFactory('UpgradedPortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    console.log('Contract addy:', waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance( waveContract.address);
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );
    
    let waveTxn = await waveContract.sign('Dani', "This is signature #1");
    await waveTxn.wait();

    waveTxn = await waveContract.sign('Dani', "This is signature #2");
    await waveTxn.wait();


    contractBalance =await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );

    let allSignatures = await waveContract.getAllSignatures();
    console.log(allSignatures);
}

main()
    .then( () => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });