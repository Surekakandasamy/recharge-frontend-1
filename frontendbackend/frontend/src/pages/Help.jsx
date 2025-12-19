import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Help() {
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      question: "How do I recharge my mobile?",
      answer: "Select your operator, enter your mobile number, choose a plan, and make payment. Your recharge will be processed instantly."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use industry-standard encryption and secure payment gateways to protect your financial information."
    },
    {
      question: "What if my recharge fails?",
      answer: "If your recharge fails, the amount will be refunded to your account within 24 hours. Contact support if you need assistance."
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are processed for failed transactions only. Successful recharges cannot be refunded as per telecom regulations."
    }
  ];

  return (
    <div className={`w-full min-h-[calc(100vh-80px)] ${themeConfig.bg} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${themeConfig.text}`}>Help & Support</h1>
          <p className={`text-lg ${themeConfig.textSecondary}`}>We're here to help you</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border rounded-lg p-1 flex space-x-1`}>
            {[
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact Us' },
              { id: 'guide', label: 'User Guide' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : `${themeConfig.text} hover:bg-blue-100 dark:hover:bg-blue-900`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`${themeConfig.cardBg} ${themeConfig.border} border p-6 rounded-xl shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-3 ${themeConfig.text}`}>{faq.question}</h3>
                <p className={`${themeConfig.textSecondary}`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-6 ${themeConfig.text}`}>Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`font-semibold mb-4 ${themeConfig.text}`}>Customer Support</h3>
                <div className="space-y-3">
                  <p className={`${themeConfig.textSecondary}`}>📞 1800-123-4567 (Toll Free)</p>
                  <p className={`${themeConfig.textSecondary}`}>📧 support@rechargeapp.com</p>
                  <p className={`${themeConfig.textSecondary}`}>🕒 24/7 Available</p>
                </div>
              </div>
              <div>
                <h3 className={`font-semibold mb-4 ${themeConfig.text}`}>Business Hours</h3>
                <div className="space-y-2">
                  <p className={`${themeConfig.textSecondary}`}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className={`${themeConfig.textSecondary}`}>Saturday: 10:00 AM - 4:00 PM</p>
                  <p className={`${themeConfig.textSecondary}`}>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-6 ${themeConfig.text}`}>How to Use RechargeApp</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className={`font-semibold ${themeConfig.text}`}>Create Account</h3>
                  <p className={`${themeConfig.textSecondary}`}>Sign up with your email and create a secure password</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className={`font-semibold ${themeConfig.text}`}>Choose Plan</h3>
                  <p className={`${themeConfig.textSecondary}`}>Browse and select from our wide range of recharge plans</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className={`font-semibold ${themeConfig.text}`}>Make Payment</h3>
                  <p className={`${themeConfig.textSecondary}`}>Complete your recharge with secure payment options</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}