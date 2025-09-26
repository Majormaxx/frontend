import { useState } from 'react';
import { useSelector } from 'react-redux';
import { apiUpdateOrganizationSettings } from '@/services/OrgService';
import { RootState } from '@/store';

/**
 * A form for updating organization settings, including the Gnosis Safe address and the recognition token address.
 * It handles user input, performs basic client-side validation, and submits the data to the backend.
 */
const SettingsForm = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [safeAddress, setSafeAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handles the form submission event.
   * It prevents the default form submission, validates the input fields,
   * and calls the organization service to update the settings on the backend.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!safeAddress || !tokenAddress) {
      setError('Please fill out both address fields.');
      return;
    }

    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(safeAddress) || !addressRegex.test(tokenAddress)) {
      setError('Please enter valid Ethereum addresses.');
      return;
    }

    try {
      if (user && user.organization) {
        await apiUpdateOrganizationSettings({
          safeAddress,
          recognitionTokenAddress: tokenAddress,
        });
        setSuccess('Settings updated successfully!');
      }
    } catch (err) {
      setError('Failed to update settings.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <div>
        <label htmlFor="safeAddress" className="block text-sm font-medium text-gray-700">
          Safe Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="safeAddress"
            id="safeAddress"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0x..."
            value={safeAddress}
            onChange={(e) => setSafeAddress(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">
          Token Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="tokenAddress"
            id="tokenAddress"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save
      </button>
    </form>
  );
};

export default SettingsForm;