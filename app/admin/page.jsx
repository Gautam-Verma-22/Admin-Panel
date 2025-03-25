'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Power4 } from 'gsap/all';

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const dashboardRef = useRef();
  const cardRefs = useRef([]);
  const headerRef = useRef();
  const logoutRef = useRef();

  // Mock data fetch
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          users: 1245,
          revenue: 34567,
          products: 567,
          orders: 89,
          recentActivities: [
            { id: 1, user: 'Jane Cooper', action: 'placed new order', time: '2 min ago', icon: '🛒' },
            { id: 2, user: 'John Smith', action: 'updated profile', time: '10 min ago', icon: '👤' },
            { id: 3, user: 'System', action: 'completed maintenance', time: '25 min ago', icon: '⚙️' },
            { id: 4, user: 'Alex Wong', action: 'submitted ticket', time: '1 hour ago', icon: '📩' },
          ],
          transactions: [
            { id: 'TRX-7890', customer: 'Alex Johnson', date: new Date(), amount: 124.99, status: 'completed' },
            { id: 'TRX-7889', customer: 'Sarah Miller', date: new Date(), amount: 89.50, status: 'processing' },
            { id: 'TRX-7888', customer: 'Michael Chen', date: new Date(Date.now() - 86400000), amount: 245.00, status: 'completed' },
            { id: 'TRX-7887', customer: 'Emily Wilson', date: new Date(Date.now() - 86400000), amount: 67.30, status: 'refunded' },
          ],
          performance: {
            loadTime: 1.2,
            uptime: 99.98,
            errors: 0.02
          }
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [timeRange]); // Refetch when time range changes

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Start animations after a brief delay
      setTimeout(() => {
        setIsLoading(false);
        initAnimations();
      }, 500);
    }
  }, [router]);

  const initAnimations = () => {
    gsap.registerPlugin(Power4);
    
    gsap.from(dashboardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: Power4.easeOut
    });
    
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: Power4.easeOut
    });
    
    gsap.from(cardRefs.current, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: Power4.easeOut
    });
    
    gsap.from(logoutRef.current, {
      x: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: Power4.easeOut
    });
    
    cardRefs.current.forEach((card, index) => {
      gsap.to(card, {
        y: -5,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };

  const handleLogout = () => {
    gsap.to(dashboardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: Power4.easeIn,
      onComplete: () => {
        localStorage.removeItem('isAuthenticated');
        router.push('/login');
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const filteredTransactions = dashboardData?.transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full filter blur-xl opacity-10 bg-gradient-to-br 
              ${i % 2 === 0 ? 'from-blue-500 to-blue-700' : 'from-emerald-500 to-emerald-700'}`}
            style={{
              width: [200, 150, 180, 220, 170][i],
              height: [200, 150, 180, 220, 170][i],
              top: `${[10, 70, 30, 85, 50][i]}%`,
              left: `${[80, 20, 65, 40, 90][i]}%`,
            }}
          />
        ))}
      </div>

      <header 
        ref={headerRef}
        className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 text-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              ref={logoutRef}
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-700/50">
          <nav className="flex space-x-8">
            {['overview', 'analytics', 'customers', 'products', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      <main 
        ref={dashboardRef}
        className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {/* Row 1 */}
          <div 
            ref={el => cardRefs.current[0] = el}
            className="md:col-span-2 bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-blue-400">Overview</h2>
              <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-400">{dashboardData.users.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">↑ 12% from last {timeRange}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(dashboardData.revenue)}</p>
                <p className="text-xs text-green-400 mt-1">↑ 8% from last {timeRange}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Conversion</p>
                <p className="text-2xl font-bold text-purple-400">3.2%</p>
                <p className="text-xs text-red-400 mt-1">↓ 0.5% from last {timeRange}</p>
              </div>
            </div>
          </div>
          
          <div 
            ref={el => cardRefs.current[1] = el}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {dashboardData.recentActivities.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="text-xl">{item.icon}</div>
                  <div>
                    <p className="font-medium text-gray-300">{item.user} <span className="text-gray-500">{item.action}</span></p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 */}
          <div 
            ref={el => cardRefs.current[2] = el}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Products</p>
                <p className="text-2xl font-bold text-purple-400">{dashboardData.products}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-blue-400">24</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Orders</p>
                <p className="text-2xl font-bold text-emerald-400">{dashboardData.orders}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">12</p>
              </div>
            </div>
          </div>
          
          <div 
            ref={el => cardRefs.current[3] = el}
            className="md:col-span-2 bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Performance Metrics</h2>
            <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance chart visualization</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Avg. Load Time</p>
                <p className="text-xl font-bold text-blue-400">{dashboardData.performance.loadTime}s</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Uptime</p>
                <p className="text-xl font-bold text-emerald-400">{dashboardData.performance.uptime}%</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Errors</p>
                <p className="text-xl font-bold text-red-400">{dashboardData.performance.errors}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Row 3 - Full width */}
        <div className="px-4 mt-6">
          <div 
            ref={el => cardRefs.current[4] = el}
            className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-400">Recent Transactions</h2>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 text-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Export <span>↓</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm text-blue-400">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{transaction.customer}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-300">{formatCurrency(transaction.amount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                          transaction.status === 'processing' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-400 hover:text-blue-300 mr-2">
                          View
                        </button>
                        <button className="text-gray-400 hover:text-gray-300">
                          More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>Showing {filteredTransactions.length} of {dashboardData.transactions.length} transactions</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-700/50 rounded-md">Previous</button>
                <button className="px-3 py-1 bg-emerald-600/50 text-emerald-400 rounded-md">1</button>
                <button className="px-3 py-1 bg-gray-700/50 rounded-md">2</button>
                <button className="px-3 py-1 bg-gray-700/50 rounded-md">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}