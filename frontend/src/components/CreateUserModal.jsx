import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';

const { Option } = Select;

const CreateUserModal = ({ open, onClose, onSave, editUser }) => {
  const [user, setUser] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    if (editUser) {
      setUser({
        _id: editUser._id || '',
        title: editUser.title || '',
        description: editUser.description || '',
        dueDate: editUser.dueDate ? editUser.dueDate : '',
        status: editUser.status || '',
        priority: editUser.priority || '',
      });
    } else {
      setUser({
        title: '',
        description: '',
        dueDate: '',
        status: '',
        priority: '',
      });
    }
  }, [editUser]);

  const handleSubmit = async() => {
    // Validate fields
    if (!user.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!user.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!user.dueDate) {
      toast.error('Due Date is required');
      return;
    }
    if (!user.status) {
      toast.error('Status is required');
      return;
    }
    if (!user.priority) {
      toast.error('Priority is required');
      return;
    }

    // Prepare user object
    const newUser = {
      ...user,
      dueDate: new Date(user.dueDate), // Ensure dueDate is in the correct format
    };

    // Call onSave
    
    try{
      let response;
      if(editUser){
        // console.log("user: ", user);
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${user._id}`, user);  
      }
      else{
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks`, user);
      }
      console.log("response : ", response)
      onSave(response.data);
    }
    catch(err){
      toast.error("Internal server error")
    }

  };

  return (
    <Modal
      title={editUser ? 'Edit Task' : 'Create New Task'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <div className="modal-field">
        <label className="field-label">Title</label>
        <Input
          value={user.title}
          onChange={(e) => setUser({ ...user, title: e.target.value })}
          placeholder="Enter title"
        />
      </div>
      <div className="modal-field">
        <label className="field-label">Description</label>
        <Input
          value={user.description}
          onChange={(e) => setUser({ ...user, description: e.target.value })}
          placeholder="Enter description"
        />
      </div>
      <div className="modal-field">
        <label className="field-label">Due Date</label>
        <Input
          type="date"
          value={user.dueDate}
          onChange={(e) => setUser({ ...user, dueDate: e.target.value })}
          placeholder="Enter due date"
        />
      </div>
      <div className="modal-field">
        <label className="field-label">Status</label>
        <Select
          value={user.status || undefined}
          onChange={(value) => setUser({ ...user, status: value })}
          placeholder="Select status"
          style={{ width: '100%' }}
        >
          <Option value="ToDo">ToDo</Option>
          <Option value="InProgress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </div>
      <div className="modal-field">
        <label className="field-label">Priority</label>
        <Select
          value={user.priority || undefined}
          onChange={(value) => setUser({ ...user, priority: value })}
          placeholder="Select priority"
          style={{ width: '100%' }}
        >
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
