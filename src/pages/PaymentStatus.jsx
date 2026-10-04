import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';
import T from '../components/T';
import Icon from '../components/Icon';

export default function PaymentStatus() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fadeRef = useFadeIn([]);
  
  const [status, setStatus] = useState('pending');
  const [paymentType, setPaymentType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Parse URL parameters
    const statusParam = searchParams.get('status') || 'pending';
    const typeParam = searchParams.get('type') || '';
    const txParam = searchParams.get('transaction_id') || '';
    const msgParam = searchParams.get('message') || '';

    setStatus(statusParam);
    setPaymentType(typeParam);
    setTransactionId(txParam);
    setMessage(msgParam);

    // Handle shop order completion after successful payment
    if (statusParam === 'success' && typeParam === 'shop') {
      // Store transaction info for order completion
      sessionStorage.setItem('pending_shop_transaction', txParam);
    }

    // Auto-redirect after 5 seconds if successful
    if (statusParam === 'success') {
      const timer = setTimeout(() => {
        redirectBasedOnType(typeParam);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const redirectBasedOnType = (type) => {
    switch (type) {
      case 'donation':
        navigate('/donate');
        break;
      case 'shop':
        // Check if there's a pending shop transaction to complete
        const pendingShopTx = sessionStorage.getItem('pending_shop_transaction');
        if (pendingShopTx) {
          sessionStorage.removeItem('pending_shop_transaction');
          navigate('/shop');
        } else {
          navigate('/shop');
        }
        break;
      case 'counselor':
        // Check if there's a pending counselor session to complete
        const pendingCounselorSession = sessionStorage.getItem('pending_counselor_session');
        if (pendingCounselorSession) {
          sessionStorage.removeItem('pending_counselor_session');
          navigate('/chat');
        } else {
          navigate('/chat');
        }
        break;
      default:
        navigate('/');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return 'check-circle';
      case 'failed':
        return 'times-circle';
      case 'pending':
        return 'clock';
      default:
        return 'info-circle';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return language === 'rw' ? 'Ishyura ryagenze neza' : 'Payment Successful';
      case 'failed':
        return language === 'rw' ? 'Ishyura ryaranse' : 'Payment Failed';
      case 'pending':
        return language === 'rw' ? 'Ishyura ririmo gukorwa' : 'Payment Processing';
      default:
        return language === 'rw' ? 'Imiterere y\'ishyura' : 'Payment Status';
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'success':
        return language === 'rw' 
          ? 'Ishyura ryawe ryakunze neza. Tuzakwiriya hamwe n\'ubutumwa bw\'ishyura.'
          : 'Your payment was successful. You will receive a confirmation message shortly.';
      case 'failed':
        return language === 'rw'
          ? 'Ishyura ryaranse. Nongera ugerageze cyangwa ubuze ubundi buryo bwo kwishyura.'
          : 'Payment failed. Please try again or use a different payment method.';
      case 'pending':
        return language === 'rw'
          ? 'Ishyura ririmo gukorwa. Tegereza gato maze usubire ipaji.'
          : 'Payment is being processed. Please wait a moment and refresh the page.';
      default:
        return language === 'rw'
          ? 'Kugira ngo usibe impuza, subira ipaji maze ugaragaza imiterere y\'ishyura.'
          : 'To avoid losing your progress, refresh the page to see the latest payment status.';
    }
  };

  const getPaymentTypeLabel = () => {
    switch (paymentType) {
      case 'donation':
        return language === 'rw' ? 'Inkunga' : 'Donation';
      case 'shop':
        return language === 'rw' ? 'Itegeko ry\'isoko' : 'Shop Order';
      case 'counselor':
        return language === 'rw' ? 'Umuhanga' : 'Counselor Access';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div ref={fadeRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Icon 
                name={getStatusIcon()} 
                className={`text-6xl mb-4 ${getStatusColor()}`}
              />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {getStatusTitle()}
              </h1>
              {paymentType && (
                <p className="text-sm text-gray-600">
                  {getPaymentTypeLabel()}
                  {transactionId && ` • ${transactionId}`}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-center">
                {getStatusMessage()}
              </p>
            </div>

            {status === 'success' && (
              <div className="text-center text-sm text-gray-500 mb-6">
                <T k="payment.autoRedirect" />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => redirectBasedOnType(paymentType)}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                {status === 'success' 
                  ? (language === 'rw' ? 'Subira ugaragaze' : 'Continue to Page')
                  : (language === 'rw' ? 'Subira ugerageze' : 'Try Again')
                }
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'rw' ? 'Ahabanza' : 'Go Home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}