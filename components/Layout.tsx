import React from 'react'
import { ConnectWallet } from './ConnectWallet'

interface LayoutProps {
  children: React.ReactNode
  account: string | null
  setProvider: (provider: any) => void
  setAccount: (account: string) => void
}

export function Layout({ children, account, setProvider, setAccount }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">DuoTrade</span>
              </div>
            </div>
            <div className="flex items-center">
              <ConnectWallet setProvider={setProvider} setAccount={setAccount} />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white shadow-lg mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 EnergyAuction. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

