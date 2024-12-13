'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface ComputeClearingProps {
  contract: ethers.Contract | null
  account: string
}

export function ComputeClearing({ contract, account }: ComputeClearingProps) {
  const [isComputing, setIsComputing] = useState(false)
  const [clearingPrice, setClearingPrice] = useState<string | null>(null)
  const [clearingQuantity, setClearingQuantity] = useState<string | null>(null)
  const [isMarketOwner, setIsMarketOwner] = useState(false)

  useEffect(() => {
    const checkMarketOwner = async () => {
      if (contract) {
        try {
          const owner = await contract.marketOwner()
          setIsMarketOwner(owner.toLowerCase() === account.toLowerCase())
        } catch (error) {
          console.error('Failed to check market owner:', error)
        }
      }
    }
    checkMarketOwner()
  }, [contract, account])

  const computeClearing = async () => {
    if (!contract) return

    setIsComputing(true)
    try {
      const gasEstimate = await contract.estimateGas.computeClearing()
      const tx = await contract.computeClearing({
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      })
      await tx.wait()
      
      const price = await contract.clearingPrice()
      const quantity = await contract.clearingQuantity()
      
      setClearingPrice(ethers.utils.formatEther(price))
      setClearingQuantity(ethers.utils.formatEther(quantity))
      
      alert('Market cleared successfully!')
    } catch (error) {
      console.error('Failed to compute clearing:', error)
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        alert('Failed to estimate gas. The transaction may fail.')
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds to perform this operation.')
      } else {
        alert('Failed to compute clearing. Please check the console for more details.')
      }
    }
    setIsComputing(false)
  }

  if (!isMarketOwner) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Compute Clearing</h2>
      <button
        onClick={computeClearing}
        disabled={isComputing}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
      >
        {isComputing ? 'Computing...' : 'Compute Clearing'}
      </button>
      {clearingPrice && clearingQuantity && (
        <div className="mt-4">
          <p className="text-lg"><strong>Clearing Price:</strong> {clearingPrice}</p>
          <p className="text-lg"><strong>Clearing Quantity:</strong> {clearingQuantity}</p>
        </div>
      )}
    </div>
  )
}

