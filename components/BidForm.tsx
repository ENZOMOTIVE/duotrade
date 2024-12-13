'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

interface BidFormProps {
  contract: ethers.Contract | null
  account: string
}

export function BidForm({ contract, account }: BidFormProps) {
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [isBidding, setIsBidding] = useState(false)
  const [bidType, setBidType] = useState<'demand' | 'supply'>('demand')

  const submitBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract) return

    setIsBidding(true)
    try {
      const tx = await contract[bidType === 'demand' ? 'demandBid' : 'supplyBid'](
        ethers.utils.parseEther(amount),
        ethers.utils.parseEther(price)
      )
      await tx.wait()
      alert(`${bidType.charAt(0).toUpperCase() + bidType.slice(1)} bid submitted successfully!`)
      setAmount('')
      setPrice('')
    } catch (error) {
      console.error('Failed to submit bid:', error)
      alert('Failed to submit bid. Please try again.')
    }
    setIsBidding(false)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Submit Bid</h2>
      <form onSubmit={submitBid} className="space-y-4">
        <div>
          <label htmlFor="bidType" className="block text-sm font-medium text-gray-700">
            Bid Type
          </label>
          <select
            id="bidType"
            value={bidType}
            onChange={(e) => setBidType(e.target.value as 'demand' | 'supply')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="demand">Demand</option>
            <option value="supply">Supply</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (ETH)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isBidding}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            bidType === 'demand' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isBidding ? 'Submitting...' : `Submit ${bidType.charAt(0).toUpperCase() + bidType.slice(1)} Bid`}
        </button>
      </form>
    </div>
  )
}

