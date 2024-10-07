import React from "react";
import Navbar from "../landing/Navbar";
import { AlertTriangle, Info, Phone, Mail } from "lucide-react";

const Disclaimer: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          Disclaimer
        </h1>
        <p className="mb-6">
          This disclaimer outlines the limitations of liability and
          responsibilities for our website and services provided by CryptoPing.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            1. No Financial Advice
          </h2>
          <p>
            The information provided on CryptoPing is for general informational
            purposes only. It should not be considered as financial advice. We
            strongly recommend consulting with a professional financial advisor
            before making any investment decisions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            2. Accuracy of Information
          </h2>
          <p>
            While we strive to provide accurate and up-to-date information, we
            make no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, suitability,
            or availability of the information, products, services, or related
            graphics contained on the website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Investment Risks</h2>
          <p>
            Cryptocurrency investments are subject to market risks and may not
            be suitable for all investors. The value of cryptocurrencies can be
            highly volatile, and past performance is not indicative of future
            results. You should be prepared to lose all of your invested
            capital.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Links</h2>
          <p>
            Our website may contain links to external sites that are not
            operated by us. We have no control over the content and practices of
            these sites and cannot accept responsibility or liability for their
            respective privacy policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, CryptoPing shall
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses resulting from your access to or use of
            our services.
          </p>
        </section>

        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold flex items-center">
            <Info className="mr-2" />
            Important Note
          </p>
          <p>
            By using CryptoPing, you acknowledge that you have read this
            disclaimer, understood it, and agree to be bound by it. If you do
            not agree with any part of this disclaimer, please do not use our
            services.
          </p>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this disclaimer, please contact us:
          </p>
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
            <li className="flex items-center">
              <Mail size={16} className="mr-2 text-indigo-400" />
              <a
                href="mailto:contact@cryptopingg.com"
                className="hover:text-indigo-600"
              >
                contact@cryptopingg.com
              </a>
            </li>
          </ul>
        </section>

        <p className="text-sm text-gray-600">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default Disclaimer;
