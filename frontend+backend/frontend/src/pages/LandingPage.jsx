import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PlanCard from '../components/PlanCard';
import Footer from '../components/Footer';
import SAMPLE_PLANS from '../data/plans';

export default function LandingPage() {
  const { themeConfig } = useTheme();
  const featuredPlans = SAMPLE_PLANS.filter(plan => plan.popular).slice(0, 3);

  return (
    <div className={`min-h-screen ${themeConfig.bg}`}>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${themeConfig.text}`}>
            Professional Mobile <span className="text-blue-600">Recharge</span> Service
          </h1>
          <p className={`text-lg mb-8 ${themeConfig.textSecondary} max-w-2xl mx-auto leading-relaxed`}>
            Experience seamless mobile recharges with our secure, fast, and reliable platform. 
            Join thousands of satisfied customers who trust us for their mobile needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className={`px-8 py-3 ${themeConfig.cardBg} ${themeConfig.border} border ${themeConfig.text} rounded-md font-medium hover:${themeConfig.secondary.split(' ')[0]} transition-colors`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${themeConfig.text}`}>Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-lg text-center shadow-sm`}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded">FAST</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${themeConfig.text}`}>Instant Processing</h3>
              <p className={`${themeConfig.textSecondary} leading-relaxed`}>Lightning-fast recharge processing with real-time confirmation and instant activation.</p>
            </div>
            <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-lg text-center shadow-sm`}>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">SECURE</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${themeConfig.text}`}>Bank-Level Security</h3>
              <p className={`${themeConfig.textSecondary} leading-relaxed`}>Advanced encryption and secure payment gateways ensure your data is always protected.</p>
            </div>
            <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-lg text-center shadow-sm`}>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xs font-bold bg-purple-100 px-2 py-1 rounded">SMART</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${themeConfig.text}`}>Smart Analytics</h3>
              <p className={`${themeConfig.textSecondary} leading-relaxed`}>Track your usage patterns and get personalized plan recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-12 rounded-lg shadow-sm`}>
            <h2 className={`text-3xl font-bold mb-4 ${themeConfig.text}`}>Ready to Get Started?</h2>
            <p className={`text-lg ${themeConfig.textSecondary} mb-8 leading-relaxed`}>
              Join our platform today and experience the convenience of instant mobile recharges 
              with competitive plans and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                Create Account
              </Link>
              <Link 
                to="/about" 
                className={`px-8 py-3 ${themeConfig.secondary} ${themeConfig.text} rounded-md font-medium transition-colors`}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}