'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompanyModal from './CompanyModal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import API_BASE_URL from '../../../../config/config';
import { useRouter } from 'next/navigation';
import useCheckToken from '@/component/common/hook/useCheckToken';
// import CustomSpin from '@/app/employee/dashboard/CustomSpin';

const CompanyMaster = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hrms/company/show`);
      setCompanies(response.data.data);
      setFilteredCompanies(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingCompany) {
        await axios.put(`${API_BASE_URL}/hrms/company/edit/${editingCompany._id}`, values);
      } else {
        await axios.post(`${API_BASE_URL}/hrms/company/create`, values);
      }
      setEditingCompany(null);
      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error submitting company:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/hrms/company/delete/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = companies.filter(company =>
      company.companyName.toLowerCase().includes(query) ||
      company.address.toLowerCase().includes(query) ||
      company.gstNumber.toLowerCase().includes(query) ||
      company.state.toLowerCase().includes(query) ||
      company.alias?.toLowerCase().includes(query)
    );
    setFilteredCompanies(filtered);
  };

    // check token part
  const router = useRouter();
  const { loadingToken, unauthorized } = useCheckToken();
  if (unauthorized) {
    router.replace("/");
    return null;
  }
  // if (loadingToken) return <CustomSpin />;

  return (
    <div className="min-h-screen  p-3 text-sm bg-gray-100 ">
      <div className="max-w-5xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-800">Company Master</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button onClick={() => { setEditingCompany(null); setIsModalOpen(true); }} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 shadow">
              + Add Company
            </button>
          </div>
        </div>
        {loading ? <div className="flex justify-center">Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCompanies.map((item) => (
              <div key={item._id} className="bg-white p-3 rounded-md shadow border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">{item.companyName}</p>
                  <p className="text-xs text-gray-600"><strong>Address:</strong> {item.address}</p>
                  <p className="text-xs text-gray-600"><strong>GST:</strong> {item.gstNumber}</p>
                  <p className="text-xs text-gray-600"><strong>State:</strong> {item.state}</p>
                  <p className="text-xs text-gray-600"><strong>Alias:</strong> {item.alias}</p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => handleEdit(item)} className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 flex items-center text-xs">
                    <FaEdit className="text-white mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 flex items-center text-xs">
                    <FaTrashAlt className="text-white mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <CompanyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          editingCompany={editingCompany}
        />
      </div>
    </div>
  );
};

export default CompanyMaster;



















