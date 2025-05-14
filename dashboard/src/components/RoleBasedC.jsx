import React, { useEffect, useState } from 'react';
import EditorDashboard from '../pages/EditorDashboard';
import ViewerDashboard from '../pages/ViewerDashboard';
import Dashboard from '../pages/Dashboard';
import { toNestErrors } from '@hookform/resolvers';

const RoleBasedC = () => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('auth_token');
       
        if (!token) {
          throw new Error('No auth token found');
        }

        const response = await fetch('http://localhost:8000/auth/get-role', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch role: ${response.status}`);
        }

        const data = await response.json();
        const fetchedRole = data.role?.toLowerCase();

        if (fetchedRole) {
          localStorage.setItem('role', fetchedRole);
          setRole(fetchedRole);
        } else {
          console.warn('Role not found in response');
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    // Only fetch if role is not already set
     
      fetchRole();
    
  }, [role]);

  if (!role) {
    return <div>Loading...</div>;
  }

  switch (role) {
    case 'editor':
      return <EditorDashboard />;
    case 'viewer':
      return <ViewerDashboard />;
    default:
      return <Dashboard />; // for "admin" or other roles
  }
};

export default RoleBasedC;
