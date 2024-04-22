import React from 'react'
import HomePageCarousel from '../components/HomePageCarousel'
import HomePageCards from '../components/HomePageCards'
import HomePageContactUs from '../components/HomePageContactUs'
import Footer from '../components/Footer'

export default function Home() {

  return (
    <div>
        <HomePageCarousel/>
        <HomePageCards/>
        <HomePageContactUs/>
        <Footer/>
    </div>
  )
}
