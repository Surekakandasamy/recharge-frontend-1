import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { themeConfig } = useTheme();

  return (
    <div className={`w-full min-h-[calc(100vh-80px)] ${themeConfig.bg} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${themeConfig.text}`}>About RechargeApp</h1>
          <p className={`text-lg ${themeConfig.textSecondary}`}>Your trusted mobile recharge partner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${themeConfig.text}`}>Our Mission</h2>
            <p className={`${themeConfig.textSecondary} leading-relaxed`}>
              To provide seamless, secure, and instant mobile recharge services to millions of users across the country. 
              We believe in making digital transactions simple and accessible for everyone.
            </p>
          </div>

          <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${themeConfig.text}`}>Why Choose Us</h2>
            <ul className={`${themeConfig.textSecondary} space-y-2`}>
              <li>✅ Instant recharge processing</li>
              <li>✅ 100% secure transactions</li>
              <li>✅ 24/7 customer support</li>
              <li>✅ Best prices guaranteed</li>
            </ul>
          </div>
        </div>

        <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-xl shadow-lg text-center`}>
          <h2 className={`text-2xl font-semibold mb-4 ${themeConfig.text}`}>Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className={`font-semibold ${themeConfig.text}`}>Email</h3>
              <p className={`${themeConfig.textSecondary}`}>support@rechargeapp.com</p>
            </div>
            <div>
              <h3 className={`font-semibold ${themeConfig.text}`}>Phone</h3>
              <p className={`${themeConfig.textSecondary}`}>1800-123-4567</p>
            </div>
            <div>
              <h3 className={`font-semibold ${themeConfig.text}`}>Address</h3>
              <p className={`${themeConfig.textSecondary}`}>Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}