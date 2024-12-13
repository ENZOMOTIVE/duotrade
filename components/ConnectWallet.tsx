'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

interface ConnectWalletProps {
  setProvider: (provider: ethers.providers.Web3Provider) => void
  setAccount: (account: string) => void
}

export function ConnectWallet({ setProvider, setAccount }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null)

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setProvider(provider)
        setAccount(address)
        setConnectedAccount(address)
      } else {
        alert('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    }
    setIsConnecting(false)
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out"
    >
      {isConnecting ? 'Connecting...' : connectedAccount ? `Connected: ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}` : 'Connect Wallet'}
    </button>
  )
}

