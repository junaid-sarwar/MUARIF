import React from 'react';
import { useSearchParams } from 'react-router-dom';
import "./paymentsuccess.css";
import { Link } from 'react-router-dom';

const PaymentSuccess = ({ user }) => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className='payment-success-page'>
            {user ? (
                <div className='success-message'>
                    <h2>Payment Successful</h2>
                    <p>Your payment with Session ID <strong>{sessionId}</strong> has been confirmed!</p>
                    <p>Your Course Subscription has been activated.</p>
                    <Link to={`/account`} className='common-btn'>Go to Dashboard</Link>
                </div>
            ) : (
                <p>Unauthorized access. Please log in.</p>
            )}
        </div>
    );
};

export default PaymentSuccess;
