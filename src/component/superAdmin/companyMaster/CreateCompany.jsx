'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyMaster = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('NEXT_PUBLIC_API_BASE_URL/hrms/company/show');
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


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());
     
     alert("sumited");
   
  };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const values = Object.fromEntries(formData.entries());

//     try {
//       if (editingCompany) {
//         await axios.put(`NEXT_PUBLIC_API_BASE_URL/hrms/company/edit/${editingCompany._id}`, values);
//       } else {
//         await axios.post('NEXT_PUBLIC_API_BASE_URL/hrms/company/create', values);
//       }
//       setEditingCompany(null);
//       setIsModalOpen(false);
//       fetchCompanies();
//     } catch (error) {
//       console.error('Error submitting company:', error);
//     }
//   };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`NEXT_PUBLIC_API_BASE_URL/hrms/company/delete/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto transform scale-90"> {/* Apply the 80% zoom here */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Company Master</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <button
              onClick={() => {
                setEditingCompany(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Company
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
        
         <div> list </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingCompany ? 'Edit Company' : 'Add Company'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['companyName', 'address', 'gstNumber', 'state', 'alias'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        name={field}
                        defaultValue={editingCompany?.[field] || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                    {editingCompany ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyMaster;





// const handleSubmit = (event) => {
//   event.preventDefault();
//   const formData = new FormData(event.target);
//   const values = Object.fromEntries(formData.entries());
//   console.log("CompanyModal value->94 line",values)
//   console.log("CompanyModal value->9466 line",values["CompanyName"])

//   const data={
//       companyName: values["CompanyName"],
//       address: values["Address"],
//       gstNumber: values["gstNumber"],
//       state: values["State"],
//       alias: values["Alias"]
//   }

//   console.log("CompanyModal value->104 line",data)

//   onSubmit(data);
// };