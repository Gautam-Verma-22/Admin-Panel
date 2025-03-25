'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Power3 } from 'gsap/all';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Refs for animation targets
  const formRef = useRef();
  const titleRef = useRef();
  const inputRefs = useRef([]);
  const buttonRef = useRef();
  const errorRef = useRef();
  const demoRef = useRef();

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(Power3);
    
    // Initial animations
    gsap.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: Power3.easeOut
    });
    
    gsap.from(formRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: Power3.easeOut
    });
    
    gsap.from(inputRefs.current, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.6,
      ease: Power3.easeOut
    });
    
    gsap.from(buttonRef.current, {
      y: 20,
      opacity: 0.7,
      duration: 0.6,
      delay: 0.2,
      ease: Power3.easeOut
    });
    
    gsap.from(demoRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.6,
      delay: 1.2,
      ease: Power3.easeOut
    });
    
    // Background animation
    const colors = ['#0f172a', '#111827', '#0c4a6e'];
    let currentIndex = 0;
    
    const animateBg = () => {
      gsap.to('body', {
        backgroundColor: colors[currentIndex],
        duration: 8,
        ease: 'none',
        onComplete: () => {
          currentIndex = (currentIndex + 1) % colors.length;
          animateBg();
        }
      });
    };
    
    animateBg();
    
    // Floating light effect
    const lights = [
      { color: '#0ea5e9', size: 150, x: 20, y: 20 },
      { color: '#10b981', size: 100, x: 80, y: 70 },
      { color: '#0ea5e9', size: 200, x: 70, y: 30 }
    ];
    
    lights.forEach((light, i) => {
      gsap.to(`.light-${i}`, {
        x: `+=${Math.random() * 40 - 20}`,
        y: `+=${Math.random() * 40 - 20}`,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: Power3.easeInOut
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Animate button press
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: Power3.easeInOut
    });

    // Validation
    if (!email || !password) {
      showError('Both email and password are required');
      return;
    }

    if (!email.includes('@')) {
      showError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Hardcoded credentials for demo
      if (email === 'admin@gmail.com' && password === 'admin123') {
        // Success animation
        gsap.to(formRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: Power3.easeIn
        });
        
        setTimeout(() => {
          localStorage.setItem('isAuthenticated', 'true');
          router.push('/admin');
        }, 600);
      } else {
        showError('Invalid credentials');
      }
    }, 1000);
  };
  
  const showError = (message) => {
    setIsLoading(false);
    setError(message);
    
    // Error animation
    gsap.fromTo(errorRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: Power3.easeOut }
    );
    
    // Shake form
    gsap.to(formRef.current, {
      x: [0, 10, -10, 10, -5, 0],
      duration: 0.6,
      ease: Power3.easeOut
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating lights */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full filter blur-xl opacity-20 light-${i}`}
          style={{
            width: [150, 100, 200][i],
            height: [150, 100, 200][i],
            backgroundColor: ['#0ea5e9', '#10b981', '#0ea5e9'][i],
            top: `${[20, 70, 30][i]}%`,
            left: `${[20, 80, 70][i]}%`
          }}
        />
      ))}
      
      <div className="relative z-10 w-full max-w-md">
        <h1 
          ref={titleRef}
          className="text-3xl font-bold text-center mb-8 text-emerald-400"
        >
          Admin Portal
        </h1>
        
        <div 
          ref={formRef}
          className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-800"
        >
          {error && (
            <div 
              ref={errorRef}
              className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md text-sm border border-red-800/50"
            >
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div ref={el => inputRefs.current[0] = el}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-200 placeholder-gray-500 transition-all duration-200"
                placeholder="admin@gmail.com"
                disabled={isLoading}
              />
            </div>
            
            <div ref={el => inputRefs.current[1] = el}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 placeholder-gray-500 transition-all duration-200"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            
            <button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${isLoading 
                ? 'bg-blue-800/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg hover:shadow-blue-500/20'}`}
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : 'Login'}
              </span>
            </button>
          </form>
          
          <div 
            ref={demoRef}
            className="mt-6 text-center text-sm text-gray-500 border-t border-gray-800 pt-4"
          >
            <p>Demo credentials: <span className="text-emerald-400">admin@gmail.com</span> / <span className="text-blue-400">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}