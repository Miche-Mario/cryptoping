import { Phone } from "lucide-react";
import React from "react";
import Navbar from "../landing/Navbar";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          At CryptoPing, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy describes how we
          collect, use, and handle your data when you use our all-in-one
          cryptocurrency tracking and analysis platform.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us, such as when
          you create an account, use our services, or contact our support team.
          This may include:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Personal information (e.g., name, email address)</li>
          <li>Account preferences and settings</li>
          <li>Transaction data related to cryptocurrency purchases</li>
          <li>Usage data and analytics information</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use your information to provide and improve our services,
          including:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Delivering real-time market data and personalized insights</li>
          <li>
            Analyzing and improving our platform's performance and user
            experience
          </li>
          <li>Communicating with you about your account and our services</li>
          <li>Ensuring the security and integrity of our platform</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">
          Data Sharing and Disclosure
        </h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your
          information in the following circumstances:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>With service providers who help us operate our platform</li>
          <li>
            To comply with legal obligations or respond to lawful requests
          </li>
          <li>
            In connection with a merger, sale, or acquisition of our business
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to
          protect your personal information. However, no method of transmission
          over the Internet or electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Your Rights and Choices</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Accessing and updating your information</li>
          <li>Requesting deletion of your data</li>
          <li>Opting out of certain data collection or use</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new Privacy Policy on
          this page and updating the "Last Updated" date.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
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

export default PrivacyPolicy;
