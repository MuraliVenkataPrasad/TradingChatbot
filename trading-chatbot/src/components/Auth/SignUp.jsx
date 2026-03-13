import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
          <span>EUR/USD <strong>+0.3%</strong></span>
        </div>
        <div className={styles.tickerItem}>
          <TrendingDown size={14} className={styles.tickerDown} />
          <span>GOLD <strong>-0.5%</strong></span>
        </div>
        <div className={styles.tickerItem}>
          <TrendingUp size={14} className={styles.tickerUp} />
          <span>OIL <strong>+1.5%</strong></span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Join TradingAI</h1>
          <p>Start your journey with smart insights</p>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className={styles.success}>
            <span>✅</span> {success}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="name">Full Name</label>
          </div>

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

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Already have an account?</span>
          <Link to="/signin">Sign in →</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;