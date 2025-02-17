import React, { useState, useEffect } from 'react';

const CompanyModal = ({ isOpen, onClose, onSubmit, editingCompany }) => {
  // Initial state for a new company
  const initialFormData = {
    companyName: '',
    address: '',
    gstNumber: '',
    state: '',
    alias: ''
  };

  // State to handle form values
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        companyName: editingCompany.companyName || '',
        address: editingCompany.address || '',
        gstNumber: editingCompany.gstNumber || '',
        state: editingCompany.state || '',
        alias: editingCompany.alias || ''
      });
    } else {
      setFormData(initialFormData); // Reset form when adding a new company
    }
  }, [editingCompany, isOpen]); // Reset when modal opens

  if (!isOpen) return null; // Ensure hooks are executed before return

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const formatLabel = (field) => {
    const formattedField = field === 'gstNumber' ? 'GST Number' : field.replace(/\b\w/g, (char) => char.toUpperCase());
    return (
      <span>
        {formattedField} <span className="text-red-500">*</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">{editingCompany ? 'Edit Company' : 'Add Company'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['companyName', 'address'], ['gstNumber', 'state'], ['alias']].map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              {row.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formatLabel(field)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="flex justify-end space-x-3 mt-4"> 
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition" 
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md" 
            >
              {editingCompany ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;


