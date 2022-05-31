import Web3 from 'web3';

export const loadContract = async (name: string, provider: any) => {
    const web3 = new Web3(provider);
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
    const contract = new web3.eth.Contract(Artifact.abi, Artifact.networks['5777']?.address);
    
    return contract;
};
