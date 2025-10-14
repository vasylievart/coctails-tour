import React from 'react';

// Define the component structure for clarity and reuse
interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
  isSubtitle?: boolean;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, children, isSubtitle = false }) => (
  <section className="mb-8">
    {isSubtitle ? (
      <h2 className="text-xl font-semibold text-indigo-700 mb-3 border-b border-indigo-200 pb-1 dark:text-indigo-400 dark:border-indigo-700">
        {title}
      </h2>
    ) : (
      <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
        {title}
      </h1>
    )}
    <div className="text-gray-700 leading-relaxed space-y-4 dark:text-gray-300">
      {children}
    </div>
  </section>
);

// Main Application Component (Exported)
const PrivacyPolicy: React.FC = () => {
  // Define placeholders for easy replacement
  const companyName = '[Your Company Name]';
  const lastUpdated = '[Add date]';
  const contactEmail = '[your email]';
  const businessAddress = '[your business address, optional if not registered business yet]';
  const businessPhone = '[optional]';
  const location = '[your location or “Spain”]';

  return (
    // Outer container for full-page centered content
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl dark:bg-gray-800 transition-colors duration-300">
        
        <header className="text-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-400">
            🔒 Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </header>

        <main className="space-y-10">

          <PolicySection title="1. Introduction">
            <p>
              Welcome to {companyName} (“we”, “our”, “us”).
            </p>
            <p>
              We value your privacy and are committed to protecting your personal data in compliance with the **General Data Protection Regulation (EU) 2016/679 (GDPR)** and the Spanish Organic Law 3/2018 (LOPDGDD) on the protection of personal data.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and booking services.
            </p>
          </PolicySection>

          <PolicySection title="2. Data Controller">
            <p>
              **Company Name:** {companyName}
            </p>
            <p>
              **Email:** <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:underline dark:text-indigo-400">{contactEmail}</a>
            </p>
            <p>
              **Address:** {businessAddress}
            </p>
            <p>
              **Phone:** {businessPhone}
            </p>
          </PolicySection>
          
          <PolicySection title="3. Data We Collect">
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
          </PolicySection>

          <PolicySection title="4. Purpose of Data Processing">
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
          </PolicySection>

          <PolicySection title="5. Legal Basis for Processing">
            <p>
              We process your data under the following legal bases:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>**Performance of a contract or pre-contractual measures:** when you make a booking or contact us for our services.</li>
              <li>**Consent:** when you voluntarily submit your personal data via forms on our website.</li>
            </ul>
            <p className="mt-3">
              You may withdraw your consent at any time by contacting us at: <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:underline dark:text-indigo-400">{contactEmail}</a>.
            </p>
          </PolicySection>

          <PolicySection title="6. Data Retention">
            <p>
              We keep your personal data only as long as necessary to fulfill the purposes described above or to comply with legal obligations.
            </p>
            <p>
              Once the purpose is fulfilled, your data will be securely deleted.
            </p>
          </PolicySection>

          <PolicySection title="7. Data Sharing">
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
          </PolicySection>

          <PolicySection title="8. Age Restriction">
            <p>
              Our website and services are intended only for individuals over **18 years of age**.
            </p>
            <p>
              We do not knowingly collect personal data from minors.
            </p>
            <p>
              If we become aware that we have received data from someone under 18, we will delete it immediately.
            </p>
          </PolicySection>

          <PolicySection title="9. Your Data Protection Rights">
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
              To exercise any of these rights, contact us at: <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:underline dark:text-indigo-400">{contactEmail}</a>.
            </p>
          </PolicySection>

          <PolicySection title="10. Security of Your Data">
            <p>
              We take appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, misuse, or alteration.
            </p>
            <p>
              However, no online service can be $100\%$ secure, and we cannot guarantee absolute data security.
            </p>
          </PolicySection>

          <PolicySection title="11. Cookies and Analytics">
            <p>
              Our website may use **essential cookies** necessary for its proper functioning.
            </p>
            <p className="font-medium mt-3">
              We do not use marketing or analytics cookies without your consent.
            </p>
            <p>
              For more details, please refer to our Cookies Policy.
            </p>
          </PolicySection>

          <PolicySection title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect legal or operational changes.
            </p>
            <p>
              Any updates will be published on this page with a new “Last updated” date.
            </p>
          </PolicySection>

          <PolicySection title="13. Contact">
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="space-y-1 ml-4 mt-2">
              <li className="font-semibold">📧 Email: <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:underline dark:text-indigo-400">{contactEmail}</a></li>
              <li className="font-semibold">📍 Address: {location}</li>
            </ul>
          </PolicySection>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
