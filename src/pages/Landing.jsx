import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export default function Landing() {
  const [state, setState] = useStore();

  const features = [
    { icon: 'MOBILE', title: 'Instant Recharge', desc: 'Quick mobile recharge for all operators' },
    { icon: 'WALLET', title: 'Digital Wallet', desc: 'Secure wallet with multiple payment options' },
    { icon: 'PLANS', title: 'Best Plans', desc: 'Compare and choose from hundreds of plans' },
    { icon: 'STATS', title: 'Analytics', desc: 'Track your spending and usage patterns' },
    { icon: 'ALERT', title: 'Smart Alerts', desc: 'Get notified about plan expiry and offers' },
    { icon: 'REWARD', title: 'Rewards', desc: 'Earn cashback and exclusive offers' }
  ];

  return (
    <div className={`min-h-screen ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <nav className={`${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-red-600">RechargeApp</div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setState({ theme: state.theme === 'light' ? 'dark' : 'light' })}
              className={`p-2 rounded-lg ${state.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-sm`}
            >
              {state.theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Recharge Made <span className="text-red-600">Simple</span>
          </h1>
          <p className={`text-xl mb-8 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Fast, secure, and convenient mobile recharge with the best plans and offers
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-red-700">
              Start Recharging
            </Link>
            <button className={`px-8 py-3 rounded-lg text-lg border-2 border-red-600 text-red-600 hover:bg-red-50 ${state.theme === 'dark' ? 'hover:bg-gray-800' : ''}`}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RechargeApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="mb-4">
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-16 px-4 ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-red-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-600">1M+</div>
              <div className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600">500+</div>
              <div className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Recharge Plans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600">99.9%</div>
              <div className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600">24/7</div>
              <div className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 ${state.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            © 2025 RechargeApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}