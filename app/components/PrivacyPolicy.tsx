"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function PrivacyPolicy() {
 
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.matches("a[href^='#']")) {
        e.preventDefault();
        const id = target.getAttribute("href")?.substring(1);
        const el = document.getElementById(id!);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <main className="min-h-screen bg-[url('/images/privacy-policy_bg.webp')] text-gray-800 px-6 py-12 md:px-12 lg:px-24">
      <article className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500">Last updated: October 2025</p>
        </header>

        <nav className="bg-orange-100  border-2 border-black rounded-2xl shadow-sm p-4 mb-10 flex flex-wrap gap-3 justify-center text-sm md:text-base">
          {[
            "introduction",
            "data controller",
            "data we collect",
            "data processing",
            "legal basis",
            "data retention",
            "data sharing",
            "age",
            "data protection",
            "security",
            "cookies",
            "changes",
            "contact"

          ].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-grey-600 hover:text-grey-800 hover:underline transition"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        <Image width={163} height={194} className="absolute z-10 top-[2%] left-[28%] w-[96px]" src="/images/escudo_barcelona.png" alt="Coat of Arms Barcelona" />
        <section id="introduction" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
              Welcome to [companyName] (“we”, “our”, “us”).
            </p>
            <p>
              We value your privacy and are committed to protecting your personal data in compliance with the **General Data Protection Regulation (EU) 2016/679 (GDPR)** and the Spanish Organic Law 3/2018 (LOPDGDD) on the protection of personal data.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and booking services.
            </p>
        </section>
        <Image width={480} height={165} className="absolute w-[480px] top-[8%] right-[4%] z-10 rotate-12" src="/images/coctails_header.webp" alt="logo" />


        <section id="controller controller" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">2. Data Controller</h2>
          <p>
              **Company Name:** [companyName]
            </p>
            <p>
              **Email:** <a href={`mailto:`} className="text-grey-600 hover:underline">contactEmail</a>
            </p>
            <p>
              **Address:** [businessAddress]
            </p>
            <p>
              **Phone:** [businessPhone]
            </p>
        </section> 
        
        <section id="data we collect" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">3. Data We Collect</h2>
          <p>
              We may collect and process the following personal data when you contact us or make a booking:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Booking details (date, time, preferences, etc.)</li>
            <li>Any message or comment you include in contact or booking forms</li>
          </ul>
          <p className="italic mt-3">
            We do not collect sensitive personal data (e.g. ID numbers, financial details, etc.) unless explicitly necessary for providing our service.
          </p>
        </section>

        <section id="data processing" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            4. Purpose of Data Processing
          </h2>
          <p>
            Your data will be used only for the following purposes:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>To contact you regarding your booking or inquiry.</li>
            <li>To manage and confirm your reservations.</li>
            <li>To provide customer support or respond to your questions.</li>
          </ul>
          <p className="mt-3 font-medium text-red-600 dark:text-red-400">
            We will never sell, share, or use your personal data for advertising, marketing, or promotional purposes without your explicit consent.
          </p>
        </section>
        
        <section id="legal basis" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm z-10">
          <h2 className="text-xl font-semibold mb-2">
            5. Legal Basis for Processing
          </h2>
          <p>
            We process your data under the following legal bases:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>**Performance of a contract or pre-contractual measures:** when you make a booking or contact us for our services.</li>
            <li>**Consent:** when you voluntarily submit your personal data via forms on our website.</li>
          </ul>
          <p className="mt-3">
            You may withdraw your consent at any time by contacting us at: <a href={`mailto:`} className="text-grey-600 hover:underline">contactEmail</a>.
          </p>
          <p className="mt-2">
            We reserve the right to remove anyone (without refund) who violates
            these rules.
          </p>
        </section>
        <Image width={240} height={325} className="absolute left-[2%] top-[150%] w-[240px] -rotate-12" src="/images/pan_con_tomate.webp" alt="Brread with tomatoes" />

        <section id="data retention" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p>
            We keep your personal data only as long as necessary to fulfill the purposes described above or to comply with legal obligations.
          </p>
          <p>
            Once the purpose is fulfilled, your data will be securely deleted.
          </p>
        </section>

        <section id="data sharing" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">7. Data Sharing</h2>
          <p>
            We do not share your personal data with third parties, except:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>When required by law or public authorities.</li>
            <li>When necessary to provide our service (e.g., trusted hosting or email providers who comply with GDPR).</li>
          </ul>
          <p className="mt-3">
            All third-party providers we use (such as hosting, email, or database services) operate within the **European Economic Area (EEA)** or under EU-approved data protection frameworks.
          </p>
        </section>
        <Image width={280} height={373} className="absolute w-[280px] right-[8%] top-[240%] rotate-6 z-10" src="/images/coctail_5.png" alt="Coctail" />

        <section id="age" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">8. Age Restriction</h2>
          <p>
            Our website and services are intended only for individuals over **18 years of age**.
          </p>
          <p>
            We do not knowingly collect personal data from minors.
          </p>
          <p>
            If we become aware that we have received data from someone under 18, we will delete it immediately.
          </p>
        </section>
        <Image width={64} height={60} className="absolute top-[332%] left-[18%] z-10" src="/images/over_18_years.webp" alt="Age restriction" />

        <section id="data protection" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">9. Your Data Protection Rights</h2>
          <p>
              As a user under the GDPR and LOPDGDD, you have the following rights:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>**Right of access:** to know what data we hold about you.</li>
              <li>**Right to rectification:** to correct inaccurate or incomplete data.</li>
              <li>**Right to erasure** (“right to be forgotten”): to request deletion of your data.</li>
              <li>**Right to restriction:** to limit how your data is processed.</li>
              <li>**Right to data portability:** to receive your data in a structured format.</li>
              <li>**Right to object:** to processing based on legitimate interest.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at: <a href={`mailto:`} className="text-grey-600 hover:underline">contactEmail</a>.
            </p>
        </section>

        <section id="security" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            10. Security of Your Data
          </h2>
          <p>
            We take appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, misuse, or alteration.
          </p>
          <p>
            However, no online service can be $100\%$ secure, and we cannot guarantee absolute data security.
          </p>
        </section>

        <section id="cookies" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            11. Cookies and Analytics
          </h2>
          <p>
            Our website may use **essential cookies** necessary for its proper functioning.
          </p>
          <p className="font-medium mt-3">
            We do not use marketing or analytics cookies without your consent.
          </p>
          <p>
            For more details, please refer to our Cookies Policy.
          </p>
        </section>

        <section id="changes" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            12. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect legal or operational changes.
          </p>
          <p>
            Any updates will be published on this page with a new “Last updated” date.
          </p>
        </section>

        <section id="contact" className="mb-10 bg-orange-100 border-2 border-black rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            13. Contact
          </h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <ul className="space-y-1 ml-4 mt-2">
            <li className="font-semibold">📧 Email: <a href={`mailto:`} className="text-grey-600 hover:underline">contactEmail</a></li>
            <li className="font-semibold">📍 Address: location</li>
          </ul>
        </section>

        

        <footer className="text-center text-sm text-gray-800 mt-10">
          <p>© 2025 Cocktail Tours Barcelona. All rights reserved.</p>
          <p>
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </article>
    </main>
  );
}

