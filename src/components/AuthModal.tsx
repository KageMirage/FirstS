'use client';

import React from 'react';
import { X } from 'lucide-react';
import { SuccessLoginModal } from './SuccessLoginModal';
import { AuthLoginForm } from './auth/AuthLoginForm';
import { AuthRegisterForm } from './auth/AuthRegisterForm';
import { AuthOtpStep } from './auth/AuthOtpStep';
import { AuthPasswordStep } from './auth/AuthPasswordStep';
import { AuthForgotPhone } from './auth/AuthForgotPhone';
import { useAuthModalState } from './auth/useAuthModalState';
import { useUI } from '../hooks/useUI';

export const AuthModal: React.FC = () => {
  const { notify } = useUI();
  const {
    isAuthModalOpen,
    mode,
    setMode,
    phoneNumber,
    deliveryMethod,
    setDeliveryMethod,
    switchOtpMethod,
    privacyAccepted,
    setPrivacyAccepted,
    hasError,
    setHasError,
    errorMessage,
    otp,
    otpError,
    newPassError,
    showSuccessModal,
    isLoading,
    getMaskedPhone,
    handlePhoneChange,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleForgotPhoneSubmit,
    handleGoogleLogin,
    handleOtpChange,
    handleVerifyOtpSubmit,
    handleResendOtp,
    handleNewPasswordSubmit,
    handleClose,
  } = useAuthModalState();

  if (!isAuthModalOpen) return null;

  if (showSuccessModal) {
    return <SuccessLoginModal isOpen={true} onClose={handleClose} onConfirm={handleClose} />;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200" 
      id="modal-auth"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
          <div className="bg-white rounded-t-[32px] sm:rounded-[28px] max-w-[460px] w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative flex flex-col transition-all max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden shrink-0" />
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Закрыть"
              id="btn-close-auth"
            >
              <X className="w-4 h-4" />
            </button>

            {mode === 'login' && (
              <AuthLoginForm
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                onSubmit={handleLoginSubmit}
                onGoogleLogin={handleGoogleLogin}
                onForgotPassword={() => { setHasError(false); setMode('forgot_phone'); }}
                onSwitchToRegister={() => { setHasError(false); setMode('register'); }}
                isLoading={isLoading}
                hasError={hasError}
                errorMessage={errorMessage}
              />
            )}

            {mode === 'register' && (
              <AuthRegisterForm
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChange={(m) => {
                  setHasError(false);
                  setDeliveryMethod(m);
                }}
                privacyAccepted={privacyAccepted}
                onTogglePrivacy={() => setPrivacyAccepted(!privacyAccepted)}
                onSubmit={handleRegisterSubmit}
                onGoogleLogin={handleGoogleLogin}
                onSwitchToLogin={() => { setHasError(false); setMode('login'); }}
                isLoading={isLoading}
                hasError={hasError}
                errorMessage={errorMessage}
              />
            )}

            {mode === 'register_otp' && (
              <AuthOtpStep
                otp={otp}
                otpError={otpError}
                maskedPhone={getMaskedPhone(phoneNumber)}
                deliveryMethod={deliveryMethod}
                isLoading={isLoading}
                onOtpChange={handleOtpChange}
                onOtpKeyDown={() => {}}
                onSubmit={(e) => handleVerifyOtpSubmit(e, true)}
                onResend={() => handleResendOtp(true)}
                onSwitchMethod={(m) => switchOtpMethod(m, true)}
                onChangePhone={() => setMode('register')}
                idPrefix="register"
              />
            )}

            {mode === 'register_password' && (
              <AuthPasswordStep
                onSubmit={(newP, confP) => handleNewPasswordSubmit(newP, confP, true)}
                error={newPassError}
                idPrefix="register"
              />
            )}

            {mode === 'forgot_phone' && (
              <AuthForgotPhone
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChange={(m) => {
                  setHasError(false);
                  setDeliveryMethod(m);
                }}
                hasError={hasError}
                errorMessage={errorMessage}
                isLoading={isLoading}
                onSubmit={handleForgotPhoneSubmit}
                onBackToLogin={() => {
                  setHasError(false);
                  setMode('login');
                }}
                onSwitchToRegister={() => {
                  setHasError(false);
                  setMode('register');
                }}
              />
            )}

            {mode === 'forgot_otp' && (
              <AuthOtpStep
                otp={otp}
                otpError={otpError}
                maskedPhone={getMaskedPhone(phoneNumber)}
                deliveryMethod={deliveryMethod}
                isLoading={isLoading}
                onOtpChange={handleOtpChange}
                onOtpKeyDown={() => {}}
                onSubmit={(e) => handleVerifyOtpSubmit(e, false)}
                onResend={() => handleResendOtp(false)}
                onSwitchMethod={(m) => switchOtpMethod(m, false)}
                onChangePhone={() => setMode('forgot_phone')}
                idPrefix="forgot"
              />
            )}

            {mode === 'forgot_new_password' && (
              <AuthPasswordStep
                onSubmit={(newP, confP) => handleNewPasswordSubmit(newP, confP, false)}
                error={newPassError}
                idPrefix="forgot"
              />
            )}
          </div>
        </div>
  );
};
