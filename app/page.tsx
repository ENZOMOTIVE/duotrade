'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { Layout } from '../components/Layout'
import { BidForm } from '../components/BidForm'
import {BidList}  from '../components/BidList'
import {ComputeClearing} from '../components/ComputerClearing'
import contractABI from '../utils/contractABI'

const CONTRACT_ADDRESS = '0xa904b4ae72b0e95cb59817abfab733a5ccb7820f' // Replace with your actual contract address

export default function Home() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    if (provider && account) {
      const signer = provider.getSigner()
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
      setContract(contractInstance)
    }
  }, [provider, account])

  return (
    <Layout account={account} setProvider={setProvider} setAccount={setAccount}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Periodic Double Auction</h1>
        {account ? (
          <>
            <BidForm contract={contract} account={account} />
            <BidList contract={contract} />
            <ComputeClearing contract={contract} account={account} />
          </>
        ) : (
          <p className="text-center text-gray-600">Please connect your wallet to interact with the auction.</p>
        )}
      </div>
    </Layout>
  )
}


