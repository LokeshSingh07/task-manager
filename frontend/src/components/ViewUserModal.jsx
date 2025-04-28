import React from 'react';
import { Modal, Descriptions, Button } from 'antd';

const ViewUserModal = ({ open, onClose, user }) => {
  return (
    <Modal
      title="Task Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {user && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">{user.title}</Descriptions.Item>
          <Descriptions.Item label="Description">{user.description}</Descriptions.Item>
          <Descriptions.Item label="Due Date">{new Date(user.dueDate).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Status">{user.status}</Descriptions.Item>
          <Descriptions.Item label="Priority">{user.priority}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ViewUserModal;
