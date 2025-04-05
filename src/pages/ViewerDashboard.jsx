import React from "react";
import "./ViewerDashboard.css" ;
import ViewerSidebar from "../components/ViewerDashboard/ViewerSidebar";
import ViewerNavbar from "../components/ViewerDashboard/ViewerNavbar";

import ViewerFileExplorer from "../components/ViewerDashboard/ViewerFileExplorer";

export const ViewerDashboard = () => {
  return (
    <div className="editor-dashboard-container">
      {" "}
      {/* Apply container class */}
      <ViewerNavbar />
      <div className="editor-dashboard-content">
        {" "}
        {/* Apply dashboard content class */}
        <ViewerSidebar className="editor-sidebar" />
        <main className="editor-main-content">
          
          <ViewerFileExplorer />
        </main>
      </div>
    </div>
  );
};

export default ViewerDashboard;
