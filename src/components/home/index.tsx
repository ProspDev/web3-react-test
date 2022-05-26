import React, { useEffect, useState } from 'react';
import './home.scss';
import Web3 from 'web3';

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
            let provider = null;

            if(window.ethereum) {
                provider = window.ethereum;
                try {
                    await provider.request({method: 'eth_requestAccounts'});
                } catch (err) {
                    console.log('User denied account access!')
                }
            } else if(window.web3) {
                provider = window.web3.currentProvider;
            } else if(!process.env.production) {
                provider = new Web3.providers.HttpProvider('http://localhost:7545');
            }
            setWeb3Api({
                web3: new Web3(provider),
                provider
            });
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
            <div>
                <span>
                    <strong>Account: </strong>
                </span>
                <span>
                    {account?? 'Not connected'}
                </span>
            </div>
            <h2>Current Balance <span className='text-primary'>10 ETH</span></h2>
            <div className='d-flex justify-content-between' style={{width: '30%'}}>
                <button className='btn btn-primary'>Donate</button>
                <button className='btn btn-primary'>Withdraw</button>
            </div>
            <div className='welcome mt-3'>
                <h3>Welcome to our DApp</h3>
            </div>
        </div>
    );
};

export default Home;