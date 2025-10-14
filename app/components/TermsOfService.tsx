"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function TermsOfService() {
  // Smooth scroll for anchor links
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
    <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12 md:px-12 lg:px-24">
      <article className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-500">Last updated: October 2025</p>
        </header>

        {/* Navigation */}
        <nav className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-10 flex flex-wrap gap-3 justify-center text-sm md:text-base">
          {[
            "about",
            "age",
            "booking",
            "cancellations",
            "behavior",
            "safety",
            "liability",
            "media",
            "privacy",
            "law",
          ].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        {/* Sections */}
        <section id="about" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">1. About Us</h2>
          <p>
            <strong>Company:</strong> Cocktail Tours Barcelona <br />
            <strong>Email:</strong> info@coctailtoursbarcelona.com <br />
            <strong>Address:</strong> Barcelona, Spain
          </p>
          <p className="mt-2">
            We organize guided cocktail and bar tours in Barcelona, showcasing
            the city’s most interesting venues, local culture, and mixology
            experiences.
          </p>
        </section>

        <section id="age" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">2. Age Restriction</h2>
          <p>
            Participation is <strong>strictly limited to individuals aged 18 or
            older</strong>. By booking a tour, you confirm that you meet this
            requirement. We may request valid ID before the tour.
          </p>
          <p className="mt-2">
            Participants under 18 will not be admitted and no refund will be
            issued.
          </p>
        </section>

        <section id="booking" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">3. Booking and Payment</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bookings can be made through our website or official partners.</li>
            <li>Full payment is required at booking unless stated otherwise.</li>
            <li>Once confirmed, you’ll receive an email with all tour details.</li>
          </ul>
          <p className="mt-2">
            If you don’t receive confirmation within 24 hours, please contact us.
          </p>
        </section>

        <section id="cancellations" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            4. Cancellations and Refund Policy
          </h2>
          <p>
            <strong>Customer cancellations:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Cancel 48+ hours before tour: <strong>Full refund</strong>.</li>
            <li>Cancel less than 48 hours before: <strong>No refund</strong>.</li>
            <li>No-shows are non-refundable.</li>
          </ul>
          <p className="mt-2">
            <strong>Organizer cancellations:</strong> If we must cancel due to
            weather, illness, or safety, you’ll receive a full refund or the
            option to reschedule.
          </p>
        </section>

        <section id="behavior" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            5. Tour Experience and Behavior
          </h2>
          <p>Participants must behave respectfully toward staff and others.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Appears intoxicated or uses illegal substances,</li>
            <li>Acts aggressively or disturbs others,</li>
            <li>Fails to follow safety instructions.</li>
          </ul>
          <p className="mt-2">
            We reserve the right to remove anyone (without refund) who violates
            these rules.
          </p>
        </section>

        <section id="safety" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">6. Health and Safety</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Alcohol consumption involves health risks.</li>
            <li>You are responsible for your personal well-being.</li>
            <li>We are not liable for injury or damage due to negligence or excessive drinking.</li>
          </ul>
          <p className="mt-2">
            Please inform us of any allergies, medical conditions, or accessibility needs before your tour.
          </p>
        </section>

        <section id="liability" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">7. Liability Disclaimer</h2>
          <p>We are not responsible for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal injury or property damage,</li>
            <li>Lost or stolen belongings,</li>
            <li>Actions of third-party venues or providers.</li>
          </ul>
          <p className="mt-2">
            We recommend having travel insurance covering these risks.
          </p>
        </section>

        <section id="media" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">8. Photography and Media</h2>
          <p>
            Photos and videos may be taken during tours for promotional purposes.
            If you do not wish to appear, please inform your guide before the tour begins.
          </p>
        </section>

        <section id="privacy" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">9. Data Protection and Privacy</h2>
          <p>
            Your data (name, email, phone number) is collected only for booking
            and communication purposes, in line with our{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-2">
            We do not sell, share, or use your data for advertising or promotions.
          </p>
        </section>

        <section id="law" className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            10. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms are governed by Spanish law. Any disputes shall be
            resolved by the courts of <strong>Barcelona, Spain</strong>.
          </p>
        </section>

        <footer className="text-center text-sm text-gray-500 mt-10">
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

