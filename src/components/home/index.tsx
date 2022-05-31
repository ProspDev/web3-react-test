import React, { useCallback, useEffect, useState } from 'react';
import './home.scss';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../../utils/load-contract';

interface Web3API {
    web3: any,
    provider: any,
    contract: any,
}

const Home: React.FC = () => {
    const [web3Api, setWeb3Api] = useState<Web3API>({
        web3: null,
        provider: null,
        contract: null,
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [shouldReload, setReload] = useState(false);

    const reloadEffect = useCallback(() => setReload(!shouldReload), [shouldReload]);
    const setAccountListener = (provider: any) => {
        provider.on('accountsChanged', (accounts: any) => setAccount(accounts[0]));
    };

    useEffect(() => {
        const loadProvider = async () => {
            const provider: any = await detectEthereumProvider();
            
            if(provider) {
                // Auto loading account
                setAccountListener(provider);

                const contract = await loadContract('Faucet', provider);
                console.log(contract.methods)
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract,
                });
            } else {
                console.error('Please install Metamask');
            }
        };

        loadProvider();
    }, []);

    useEffect(() => {
        const loadBalance = async () => {
            const { web3, contract } = web3Api;
            const _balance = await web3?.eth.getBalance(contract._address);
            setBalance(web3?.utils.fromWei(_balance, 'ether'));
        };

        web3Api.contract && loadBalance();
    }, [web3Api, shouldReload]);

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth?.getAccounts();
            setAccount(accounts[0]);
        };

        web3Api.web3 && getAccount();
    }, [web3Api.web3]);

    const addFunds = useCallback( async () => {
        const { web3, contract } = web3Api;
        try {
            await contract.methods.addFunds().send({
                from: account,
                value: web3.utils.toWei('0.01', 'ether')
            });
            
            reloadEffect();
        } catch (err) {
            console.log(err);
            alert('Transaction failed for some reason.');
        }
    }, [web3Api, account, reloadEffect]);

    const withdrawFunds = async () => {
        const { web3, contract } = web3Api;
        try {
            const withdrawAmount = web3.utils.toWei('0.01', 'ether');
            await contract.methods.withdraw(withdrawAmount).send({
                from: account,
            });

            reloadEffect();
        } catch(err) {
            console.log(err);
            alert('Transaction failed for some reason.');
        }
    };

    return (
        <div className='vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className='mb-3'>
                <span>
                    <strong>Account: </strong>
                </span>
                {account? (
                    <span>{account}</span>
                ) : (
                    <button className='btn btn-info ms-2'
                        onClick={() => web3Api.provider.request({method: 'eth_requestAccounts'})}
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
            <h2>Current Balance <span className='text-primary'>{balance} ETH</span></h2>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-outline-primary mx-2'
                    onClick={addFunds}
                >Donate (0.01 ETH)</button>
                <button className='btn btn-outline-success mx-2'
                    onClick={withdrawFunds}
                >Withdraw (0.01 ETH)</button>
            </div>
            <div className='welcome mt-3'>
                <h3>Welcome to our DApp</h3>
            </div>
        </div>
    );
};

export default Home;