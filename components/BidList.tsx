'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface Bid {
  bidder: string
  amount: ethers.BigNumber
  price: ethers.BigNumber
}

interface BidListProps {
  contract: ethers.Contract | null
}

export function BidList({ contract }: BidListProps) {
  const [demandBids, setDemandBids] = useState<Bid[]>([])
  const [supplyBids, setSupplyBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBids = async () => {
    if (!contract) return

    setIsLoading(true)
    try {
      const bids = await contract.getBids()
      setDemandBids(bids[0])
      setSupplyBids(bids[1])
    } catch (error) {
      console.error('Failed to fetch bids:', error)
      alert('Failed to fetch bids. Please try again.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (contract) {
      fetchBids()
    }
  }, [contract])

  const renderBidTable = (bids: Bid[], title: string) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {bids.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ETH)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (ETH)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bids.map((bid, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ethers.utils.formatEther(bid.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ethers.utils.formatEther(bid.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No bids available.</p>
      )}
    </div>
  )

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Bids</h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading bids...</p>
      ) : (
        <>
          {renderBidTable(demandBids, "Demand Bids")}
          {renderBidTable(supplyBids, "Supply Bids")}
        </>
      )}
      <button
        onClick={fetchBids}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
      >
        Refresh Bids
      </button>
    </div>
  )
}

