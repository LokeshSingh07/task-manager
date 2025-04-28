import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import ViewUserModal from './ViewUserModal';
import { Tooltip, Button, Input } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const UserTable = ({ inputUrl, setInputUrl }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/import`, { url: inputUrl });
      const fetchedData = response.data.data.map((item, index) => ({
        ...item,
        // profession: ['Engineer', 'Doctor', 'Teacher', 'Designer', 'Developer'][index % 5],
        // gender: index % 2 === 0 ? 'Male' : 'Female',
        // experience: Math.floor(Math.random() * 10) + 1,
        completed: false,
      }));
      setData(fetchedData);
      setFilteredData(fetchedData);
      toast.success('Data fetched successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };


  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks`); // Assuming `/tasks` fetches all
      const fetchedData = response.data.map((item, index) => ({
        ...item,
        completed: false,
      }));
      // console.log("response:  ", response);
      setData(fetchedData);
      setFilteredData(fetchedData);
      toast.success('All data fetched successfully!');
    } catch (error) {
      console.error('Error fetching all data:', error);
      toast.error('Failed to fetch all data');
    }
  };  

  useEffect(() => {
    fetchAllData();
  }, []);
  



  useEffect(() => {
    const filtered = data.filter((item) =>
      [item.title, item.description, item.status, item.priority].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    );
    setFilteredData(filtered);
    if (searchTerm && filtered.length === 0) {
      toast.error('No users found matching your search');
    }
  }, [searchTerm, data]);

  const handleView = (row) => {
    setViewUser(row);
    setOpenViewModal(true);
  };

  const handleEdit = (row) => {
    // console.log("row data: ", row);
    setEditUser(row);
    // console.log(editUser);
    setOpenCreateModal(true);
  };

  const handleDelete = async(_id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${_id}`);
      console.log("response : ", response)
      setData(data.filter((item) => item._id !== _id));

      toast.success(response.data.message || 'Task deleted successfully!');
    }
  };

  const handleComplete = (_id) => {
    setData(data.map((item) => (item._id === _id ? { ...item, completed: true } : item)));
    toast.success(`User ID: ${_id} marked as complete!`, { icon: '✅' });
  };

  const handleSaveUser = (user) => {
    const parsedUser = {
      ...user,
      experience: parseInt(user.experience),
      completed: false,
    };

    if (editUser) {
      setData(data.map((item) => (item._id === parsedUser._id ? parsedUser : item)));
      toast.success('User updated successfully!');
    } else {
      // New user
      if (data.some((item) => item._id === parsedUser._id)) {
        toast.error('User ID already exists!');
        return;
      }
      setData([...data, parsedUser]);
      toast.success('User created successfully!');
    }
    setOpenCreateModal(false);
    setEditUser(null);
  };

  const columns = [
    {
      name: 'S.No',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: 'ID',
      selector: (row) => row._id,
      sortable: true,
      width: '250px',
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Priority',
      selector: (row) => row.priority,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-buttons flex gap-2">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(row)}
              className="action-btn view"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(row)}
              className="action-btn edit"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(row._id)}
              className="action-btn delete"
            />
          </Tooltip>
          <Tooltip title="Mark as Complete">
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => handleComplete(row._id)}
              className={row.completed ? 'action-btn disabled' : 'action-btn complete'}
              disabled={row.completed}
            />
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      width: '200px',
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f9fafb',
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      },
    },
    cells: {
      style: {
        padding: '12px',
        fontSize: '14px',
      },
    },
    table: {
      style: {
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
      },
    },
  };

  return (
    <div className="table-container">
      <div className="input-section flex gap-2 mb-4">
        <Input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter API URL"
          className="url-input"
        />
        <Button type="primary" onClick={fetchData} className="fetch-btn">
          Fetch Data
        </Button>
      </div>

      <div className="control-section flex gap-2 mb-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Title, Description, Status, or Priority"
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <Button
          type="primary"
          onClick={() => {
            setEditUser(null);
            setOpenCreateModal(true);
          }}
          className="create-btn"
        >
          Create New User
        </Button>
      </div>

      {filteredData.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          responsive
        />
      ) : (
        <div className="no-data text-center text-gray-500 mt-10">
          No users found
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setEditUser(null);
        }}
        onSave={handleSaveUser}
        editUser={editUser}
      />

      <ViewUserModal
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setViewUser(null);
        }}
        user={viewUser}
      />
    </div>
  );
};

export default UserTable;
