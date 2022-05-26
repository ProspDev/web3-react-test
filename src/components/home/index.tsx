import React, { useEffect, useState } from 'react';
import './home.scss';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

interface Web3API {
    web3: any,
    provider: any
}

const Home: React.FC = () => {
    const [web3Api, setWeb3Api] = useState<Web3API>({
        web3: null,
        provider: null
    });

    const [account, setAccount] = useState(null);

    useEffect(() => {
        const loadProvider = async () => {
            const provider: any = await detectEthereumProvider();

            if(provider) {
                setWeb3Api({
                    web3: new Web3(provider),
                    provider
                });
            } else {
                console.error('Please install Metamask');
            }
        };

        loadProvider();
    }, []);

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth?.getAccounts();
            setAccount(accounts[0]);
        };

        web3Api.web3 && getAccount();
    }, [web3Api.web3]);

    console.log(account);

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
            <h2>Current Balance <span className='text-primary'>10 ETH</span></h2>
            <div className='d-flex justify-content-between' style={{width: '30%'}}>
                <button className='btn btn-outline-primary'>Donate</button>
                <button className='btn btn-outline-success'>Withdraw</button>
            </div>
            <div className='welcome mt-3'>
                <h3>Welcome to our DApp</h3>
            </div>
        </div>
    );
};

export default Home;