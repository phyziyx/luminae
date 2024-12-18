import { useState } from 'react';
import { Agency } from '@prisma/client';
import AgencyManager from '@/lib/managers/agencyManager';

type CreateAgencyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (agency: Agency) => void;
};

const CreateAgencyModal = ({ isOpen, onClose, onSuccess }: CreateAgencyModalProps) => {
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async () => {
    // Call the API or function to create the agency
    try {
      const newAgency = await AgencyManager.createAgency({
        name,
        companyEmail,
        companyPhone,
        address,
        city,
        state,
        country,
        zipCode,
        agencyLogo: '', // Add logo if needed
      });

      if (newAgency) {
        onSuccess(newAgency); // Notify parent component of the new agency
        onClose(); // Close modal
      } else {
        alert('Failed to create agency');
      }
    } catch (error) {
      console.error('Error creating agency:', error);
      alert('Error creating agency');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Agency</h2>
        <form>
          <input
            type="text"
            placeholder="Agency Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Company Email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company Phone"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </form>
        <button onClick={handleSubmit}>Create Agency</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateAgencyModal;
