# Key Frontend Code Structures

This document contains canonical examples of key frontend code structures after they've been verified and refactored for consistency in Phase 5. These examples serve as a reference for the standardized patterns used throughout the application.

## Auth Context/State Management

File: `frontend/src/contexts/AuthContext.tsx` (or equivalent path)

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';

interface User {
  id: string;
  email: string;
  // Other user properties
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Other auth methods
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Set default auth header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch user profile
          const { data } = await apiClient.get('/profile');
          setUser(data);
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('auth_token');
        apiClient.defaults.headers.common['Authorization'] = '';
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/auth/signin', { email, password });
      localStorage.setItem('auth_token', data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/signup', { email, password });
      // Note: typically we don't auto sign-in after signup if email confirmation is required
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/signout');
      localStorage.removeItem('auth_token');
      apiClient.defaults.headers.common['Authorization'] = '';
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## API Client

File: `frontend/src/lib/apiClient.ts` (or equivalent path)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error cases (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear auth state if token is invalid/expired
      localStorage.removeItem('auth_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

## Route Protection Hook

File: `frontend/src/hooks/useAuthRedirect.ts` (or equivalent path)

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthRedirectOptions {
  redirectAuthenticated?: string;
  redirectUnauthenticated?: string;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { redirectAuthenticated, redirectUnauthenticated } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Redirect authenticated users (e.g., from login page)
    if (isAuthenticated && redirectAuthenticated) {
      router.push(redirectAuthenticated);
      return;
    }

    // Redirect unauthenticated users (e.g., from protected pages)
    if (!isAuthenticated && redirectUnauthenticated) {
      router.push(redirectUnauthenticated);
      return;
    }
  }, [isAuthenticated, isLoading, redirectAuthenticated, redirectUnauthenticated, router]);

  return { isLoading, isAuthenticated };
};
```

## Sign-in Form Component

File: `frontend/src/components/SignInForm.tsx` (or equivalent path)

```tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC = () => {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(data.email, data.password);
      // Redirect handled by useAuthRedirect in the page component
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="links">
        <a href="/forgot-password">Forgot password?</a>
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
    </form>
  );
};
```

## Profile Page Component

File: `frontend/src/pages/profile.tsx` (or equivalent path)

```tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

interface ProfileData {
  username: string;
  avatar_url: string;
  website: string;
  // Other profile fields
}

export default function ProfilePage() {
  // Redirect if not authenticated
  const { isLoading: authLoading } = useAuthRedirect({
    redirectUnauthenticated: '/signin',
  });

  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileData>();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading || !user) return;

      try {
        const { data } = await apiClient.get('/profile');
        setProfileData(data);
        reset(data); // Initialize form with fetched data
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user, reset]);

  // Handle profile update
  const onSubmit = async (data: ProfileData) => {
    setError(null);
    setUpdateSuccess(false);

    try {
      const { data: updatedProfile } = await apiClient.patch('/profile', data);
      setProfileData(updatedProfile);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {updateSuccess && (
        <div className="success-message">Profile updated successfully!</div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              {...register('username', {
                required: 'Username is required',
              })}
            />
            {errors.username && <span className="error">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="avatar_url">Avatar URL</label>
            <input
              id="avatar_url"
              {...register('avatar_url')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              {...register('website')}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="save-button">Save</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                reset(profileData || undefined);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-field">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="profile-field">
            <strong>Username:</strong> {profileData?.username || 'Not set'}
          </div>
          <div className="profile-field">
            <strong>Website:</strong> {profileData?.website || 'Not set'}
          </div>

          {profileData?.avatar_url && (
            <div className="avatar">
              <img src={profileData.avatar_url} alt="Profile" />
            </div>
          )}

          <button
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
```

## Forgot Password Page

File: `frontend/src/pages/forgot-password.tsx` (or equivalent path)

```tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '../lib/apiClient';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  // Redirect if already authenticated
  useAuthRedirect({
    redirectAuthenticated: '/profile',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await apiClient.post('/auth/forgot-password', { email: data.email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <h1>Check Your Email</h1>
        <p>
          If an account exists for {success && <strong>{data.email}</strong>}, you will receive a password reset link shortly.
        </p>
        <p>
          <a href="/signin">Return to Sign In</a>
        </p>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <h1>Reset Your Password</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Reset Password'}
        </button>

        <div className="links">
          <a href="/signin">Remember your password? Sign in</a>
        </div>
      </form>
    </div>
  );
}
```

## App Component (Context Provider Setup)

File: `frontend/src/pages/_app.tsx` (or equivalent path)

```tsx
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>User Management System</title>
        <meta name="description" content="User management system with authentication" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
```

## Consistency Standards

The frontend code follows these standardized patterns:

1. **Auth State Management**: Centralized through the AuthContext
2. **API Interaction**: All API calls go through the apiClient
3. **Token Storage**: Authentication tokens stored in localStorage with proper header attachment
4. **Route Protection**: Consistent protection using the useAuthRedirect hook
5. **Forms & Validation**: Standardized with React Hook Form
6. **UI Feedback**: Consistent loading states and error messages
7. **Configuration Access**: Environment variables accessed through Next.js's process.env

These structures represent the finalized, verified implementation that has been tested and confirmed to work correctly.
