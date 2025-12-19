import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { themeConfig } = useTheme();
  
  return (
    <footer className={`${themeConfig.cardBg} ${themeConfig.border} border-t py-12 px-6 mt-auto`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`font-bold text-lg mb-4 ${themeConfig.text}`}>RechargeApp</h3>
            <p className={`${themeConfig.textSecondary} leading-relaxed`}>
              Professional mobile recharge platform providing secure, fast, and reliable services to customers nationwide.
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 ${themeConfig.text}`}>Services</h4>
            <ul className="space-y-2">
              <li><a href="/about" className={`${themeConfig.textSecondary} hover:${themeConfig.text} transition-colors`}>About Us</a></li>
              <li><a href="/help" className={`${themeConfig.textSecondary} hover:${themeConfig.text} transition-colors`}>Support Center</a></li>
              <li><span className={`${themeConfig.textSecondary}`}>Terms of Service</span></li>
              <li><span className={`${themeConfig.textSecondary}`}>Privacy Policy</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 ${themeConfig.text}`}>Contact Information</h4>
            <div className="space-y-2">
              <p className={`${themeConfig.textSecondary}`}>Email: support@rechargeapp.com</p>
              <p className={`${themeConfig.textSecondary}`}>Phone: 1800-123-4567</p>
              <p className={`${themeConfig.textSecondary}`}>Available 24/7</p>
            </div>
          </div>
        </div>
        <div className={`border-t ${themeConfig.border} mt-8 pt-6 text-center`}>
          <p className={`${themeConfig.textSecondary}`}>
            © 2025 RechargeApp. All rights reserved. | Professional Mobile Recharge Services
          </p>
        </div>
      </div>
    </footer>
  );
}