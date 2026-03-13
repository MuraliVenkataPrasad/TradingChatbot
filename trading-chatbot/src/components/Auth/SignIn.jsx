import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Decorative market ticker */}
      <div className={styles.marketTicker}>
        <div className={styles.tickerItem}>
          <TrendingUp size={14} className={styles.tickerUp} />
          <span>S&P 500 <strong>+0.8%</strong></span>
        </div>
        <div className={styles.tickerItem}>
          <TrendingDown size={14} className={styles.tickerDown} />
          <span>BTC <strong>-2.1%</strong></span>
        </div>
        <div className={styles.tickerItem}>
          <TrendingUp size={14} className={styles.tickerUp} />
          <span>NASDAQ <strong>+1.2%</strong></span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your trading journey</p>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <Link to="/signup">Create free account →</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;