import React from "react";
import Navbar from "../landing/Navbar";
import { Phone } from "lucide-react";

const TermsOfService: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">
          Welcome to CryptoPing. These Terms of Service govern your use of our
          all-in-one cryptocurrency tracking and analysis platform. By using our
          services, you agree to these terms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using CryptoPing, you agree to be bound by these Terms
          of Service and all applicable laws and regulations. If you do not
          agree with any part of these terms, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold mb-3">2. Use of Services</h2>
        <p className="mb-4">
          You agree to use our services only for lawful purposes and in
          accordance with these Terms of Service. You are prohibited from:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Using the service for any illegal activities</li>
          <li>Attempting to gain unauthorized access to our systems</li>
          <li>Interfering with or disrupting the integrity of our services</li>
          <li>Impersonating another person or entity</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">3. Account Registration</h2>
        <p className="mb-4">
          To access certain features of our platform, you may be required to
          register for an account. You agree to provide accurate, current, and
          complete information during the registration process and to update
          such information to keep it accurate, current, and complete.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          4. Intellectual Property
        </h2>
        <p className="mb-4">
          The content, features, and functionality of CryptoPing are owned by us
          and are protected by international copyright, trademark, patent, trade
          secret, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          5. Disclaimer of Warranties
        </h2>
        <p className="mb-4">
          Our services are provided "as is" and "as available" without any
          warranties of any kind, either express or implied. We do not guarantee
          the accuracy, completeness, or usefulness of any information on our
          platform.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          6. Limitation of Liability
        </h2>
        <p className="mb-4">
          In no event shall CryptoPing be liable for any indirect, incidental,
          special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible
          losses.
        </p>

        <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms of Service at
          any time. It is your responsibility to check these Terms periodically
          for changes.
        </p>

        <h2 className="text-2xl font-semibold mb-3">8 .Contact Us</h2>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Phone size={16} className="mr-2 text-indigo-400" />
              <span>Canada: +1 4314309069</span>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-2 text-indigo-400" />
              <span>UK: +447588674655</span>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-2 text-indigo-400" />
              <span>Netherlands: +3197010256219</span>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-2 text-indigo-400" />
              <span>Switzerland: +41799072418</span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default TermsOfService;
