// src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resendVerification, verifyEmailService } from '../../services/authService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const VerifyEmail = () => {
  const { userId, otp } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!userId || !otp) {
        setVerificationStatus('error');
        setMessage('Invalid verification link');
        setIsLoading(false);
        return;
      }

      // Check if user is already verified in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If user is already verified, skip API call
      if (currentUser.id === userId && (currentUser.email_verified || currentUser.isVerified)) {
        setVerificationStatus('success');
        setMessage('Email is already verified!');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Verifying email for user:', userId);
        
        // Call the verification API using the service function
        const response = await verifyEmailService(userId, otp);
        // console.log('Verification response:', response);
        
        // Handle the Axios response structure
        if (response.status === 200 && response.data.user.isVerified==true) {
          setVerificationStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');

          // Update local storage with verification status
          const updatedUser = {
            ...currentUser,
            email_verified: true,
            isVerified: true,
            ...response.data.user // Include any updated user data from API
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
        } else {
          setVerificationStatus('error');
          setMessage(response.data.data?.message || 'Email verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [userId, otp]);

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      setMessage('Sending verification email...');
      
      // Get current user from localStorage or use the userId from params
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userIdToUse = userId || currentUser.id;

      if (!userIdToUse) {
        setMessage('User not found. Please log in again.');
        setResendLoading(false);
        return;
      }

      // Call resend verification API using the service function
      const response = await resendVerification(userIdToUse);
      // console.log('Resend verification response:', response);

      // Handle the Axios response structure properly
      if (response.status === 200 && response.data.data) {
        setMessage(response.data.data.message || 'Verification email sent successfully! Check your inbox.');
      } else {
        setMessage(response.data.data?.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <span className="text-3xl">📧</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <div className="text-center">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            ) : verificationStatus === 'success' ? (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verification Successful!</h3>
                <p className="text-sm text-gray-600">{message}</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                  <Link
                    to="/settings"
                    className="inline-block w-full text-center text-sm text-green-600 hover:text-green-500"
                  >
                    Update Profile Settings
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verification Failed</h3>
                <p className="text-sm text-gray-600">{message}</p>
                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  <Link
                    to="/support"
                    className="inline-block w-full text-center text-sm text-gray-600 hover:text-gray-500"
                  >
                    Need help? Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;