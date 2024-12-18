import { useState, useEffect } from 'react';
import { Agency } from '@prisma/client';
import AgencyManager from '@/lib/managers/agencyManager';

type UpdateAgencyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency;
  onSuccess: (updatedAgency: Agency) => void;
};

const UpdateAgencyModal = ({ isOpen, onClose, agency, onSuccess }: UpdateAgencyModalProps) => {
  const [name, setName] = useState(agency.name);
  const [companyEmail, setCompanyEmail] = useState(agency.companyEmail);
  const [companyPhone, setCompanyPhone] = useState(agency.companyPhone);
  const [address, setAddress] = useState(agency.address);
  const [city, setCity] = useState(agency.city);
  const [state, setState] = useState(agency.state);
  const [country, setCountry] = useState(agency.country);
  const [zipCode, setZipCode] = useState(agency.zipCode);

  useEffect(() => {
    if (agency) {
      setName(agency.name);
      setCompanyEmail(agency.companyEmail);
      setCompanyPhone(agency.companyPhone);
      setAddress(agency.address);
      setCity(agency.city);
      setState(agency.state);
      setCountry(agency.country);
      setZipCode(agency.zipCode);
    }
  }, [agency]);

  const handleSubmit = async () => {
    try {
      const updatedAgency = await AgencyManager.updateAgency({
        id: agency.id,
        name,
        companyEmail,
        companyPhone,
        address,
        city,
        state,
        country,
        zipCode,
        agencyLogo: agency.agencyLogo, // Keep the logo if needed
      });

      if (updatedAgency) {
        onSuccess(updatedAgency); // Notify parent component of the updated agency
        onClose(); // Close modal
      } else {
        alert('Failed to update agency');
      }
    } catch (error) {
      console.error('Error updating agency:', error);
      alert('Error updating agency');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Agency</h2>
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
        <button onClick={handleSubmit}>Update Agency</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UpdateAgencyModal;