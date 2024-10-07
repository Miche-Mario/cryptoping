import React from 'react'
import Navbar from './landing/Navbar'
import HeroSection from './landing/HeroSection'
import CryptoMarketData from './landing/CryptoMarketData'
import Footer from './landing/Footer'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <Navbar />
      <HeroSection />
      <CryptoMarketData />
      <Footer />
    </div>
  )
}

export default LandingPage