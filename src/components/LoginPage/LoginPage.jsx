import { useState } from 'react';
import { Brain, Eye, EyeOff, Mail, AlertCircle, CheckCircle, User } from 'lucide-react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getStoredUsers = () => {
    const stored = sessionStorage.getItem('registeredUsers');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      { email: 'user@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' },
      { email: 'test@test.com', password: 'test123', firstName: 'Jane', lastName: 'Smith' }
    ];
  };

  const [mockUsers, setMockUsers] = useState(getStoredUsers());

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      if (isLogin) {
        const user = mockUsers.find(
          u => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          setIsLoading(false);
          onLogin({
            success: true,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        } else {
          setIsLoading(false);
          setErrors({ submit: 'Invalid email or password' });
        }
      } else {
        const existingUser = mockUsers.find(u => u.email === formData.email);
        
        if (existingUser) {
          setIsLoading(false);
          setErrors({ submit: 'User with this email already exists' });
        } else {
          const newUser = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
          const updatedUsers = [...mockUsers, newUser];
          setMockUsers(updatedUsers);
          sessionStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          
          setIsLoading(false);
          onLogin({
            success: true,
            user: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName
            }
          });
        }
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    setErrors({});
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <Brain size={40} className="logo-icon" />
            <h1 className="app-title">MindCare</h1>
          </div>
          <h2 className="login-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="login-subtitle">
            {isLogin 
              ? 'Sign in to continue your mental wellness journey' 
              : 'Join us to start your mental wellness journey'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="name-row">
              <div className="input-group">
                <label className="input-label">First Name</label>
                <div className="input-container">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Last Name</label>
                <div className="input-container">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.email}
              </span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.password}
              </span>
            )}
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  <AlertCircle size={16} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="error-message submit-error">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <CheckCircle size={20} />
              </>
            )}
          </button>

          <div className="form-divider">
            <span>or</span>
          </div>

          <p className="toggle-mode">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-button"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;