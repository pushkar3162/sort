import React from 'react';
import EditorDashboard from '../pages/EditorDashboard';
import ViewerDashboard from '../pages/ViewerDashboard';
import Dashboard from '../pages/Dashboard';
const RoleBasedC = () => {
 
    let role = '';

    try {
      const stored = JSON.parse(localStorage.getItem('members'));
      if (
        stored &&
        Array.isArray(stored.members) &&
        stored.members.length > 0 &&
        stored.members[0].role
      ) {
        role = stored.members[0].role.toLowerCase();
      }
    } catch (e) {
      console.error('Failed to parse role from localStorage', e);
    }
  
    switch (role) {
      case 'editor':
        return <EditorComponent />;
      case 'viewer':
        return <ViewerDashboard />;
      default:
      
        return <Dashboard />;
    }
  };
  
 

  
  

export default RoleBasedC;
