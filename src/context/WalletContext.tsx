'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const MONAD_TESTNET_CHAIN_ID = 10143;
const MONAD_TESTNET_HEX = '0x279f';

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isWrongNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  chainId: null,
  isConnected: false,
  isWrongNetwork: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const isConnected = Boolean(address);
  const isWrongNetwork = isConnected && chainId !== MONAD_TESTNET_CHAIN_ID;

  const checkEthereum = () => {
    return typeof window !== 'undefined' && Boolean((window as any).ethereum);
  };

  const updateWalletState = async () => {
    if (!checkEthereum()) return;
    try {
      const ethereum = (window as any).ethereum;
      const accounts: string[] = await ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        const currentChainIdHex: string = await ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(currentChainIdHex, 16));
      } else {
        setAddress(null);
        setChainId(null);
      }
    } catch (err) {
      console.error('Error checking wallet state:', err);
    }
  };

  useEffect(() => {
    updateWalletState();

    if (checkEthereum()) {
      const ethereum = (window as any).ethereum;
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
          setChainId(null);
        }
      };

      const handleChainChanged = (hexChainId: string) => {
        setChainId(parseInt(hexChainId, 16));
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (!checkEthereum()) {
      alert('MetaMask atau Web3 Wallet tidak ditemukan. Silakan pasang ekstensi MetaMask.');
      return;
    }

    try {
      const ethereum = (window as any).ethereum;
      const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        const currentChainIdHex: string = await ethereum.request({ method: 'eth_chainId' });
        const netId = parseInt(currentChainIdHex, 16);
        setChainId(netId);

        if (netId !== MONAD_TESTNET_CHAIN_ID) {
          await switchNetwork();
        }
      }
    } catch (err: any) {
      console.error('User rejected wallet connection:', err);
    }
  };

  const switchNetwork = async () => {
    if (!checkEthereum()) return;
    const ethereum = (window as any).ethereum;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_HEX }],
      });
      setChainId(MONAD_TESTNET_CHAIN_ID);
    } catch (switchError: any) {
      // Error 4902: Chain is not added to wallet yet
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MONAD_TESTNET_HEX,
                chainName: 'Monad Testnet',
                nativeCurrency: {
                  name: 'Monad',
                  symbol: 'MON',
                  decimals: 18,
                },
                rpcUrls: ['https://testnet-rpc.monad.xyz'],
                blockExplorerUrls: ['https://testnet.monadexplorer.com'],
              },
            ],
          });
          setChainId(MONAD_TESTNET_CHAIN_ID);
        } catch (addError) {
          console.error('Failed to add Monad Testnet to wallet:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setChainId(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isConnected,
        isWrongNetwork,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
