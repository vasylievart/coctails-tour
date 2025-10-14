"use client"
import Image from "next/image"
import Link from "next/link";


const Footer = () => {
  return (
    <div className="flex flex-row text-white  py-12 gap-10 px-4 mx-4 items-center">
      <p>Coctails Tours Barcelona 2025</p>
      <Link href="/privacy-policy/" target="_blanc">Privacy Policy</Link>
      <Link href="/terms-of-service" target="_blanc">Terms Of Service</Link>
      <div>
        <Image src="/images/age_restriction.png" alt="Age restriction" width={48} height={48}/>
      </div>
    </div>
  )
}

export default Footer;