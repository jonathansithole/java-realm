// src/components/PasswordStrengthIndicator.jsx

import React from 'react';

// Icons remain the same
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> );
const CrossIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> );

const ValidationItem = ({ isValid, text }) => (
    // Updated text colors for better contrast on a light background
    <li className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? <CheckIcon /> : <CrossIcon />}
        <span className="text-sm">{text}</span>
    </li>
);

export default function PasswordStrengthIndicator({ validations }) {
  // Updated background to a subtle gray to fit inside the white card
  return (
    <div className="bg-gray-100 p-3 rounded-md mt-2">
      <ul className="space-y-1">
        <ValidationItem isValid={validations.length} text="At least 8 characters" />
        <ValidationItem isValid={validations.uppercase} text="Contains an uppercase letter (A-Z)" />
        <ValidationItem isValid={validations.lowercase} text="Contains a lowercase letter (a-z)" />
        <ValidationItem isValid={validations.number} text="Contains a number (0-9)" />
        <ValidationItem isValid={validations.specialChar} text="Contains a special character (!@#$%^&*)" />
      </ul>
    </div>
  );
}