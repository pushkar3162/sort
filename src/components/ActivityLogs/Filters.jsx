import React from "react";

const Filters = ({ filters, setFilters, applyFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters-container">
      <input
        type="text"
        name="user"
        placeholder="Filter by user"
        value={filters.user}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="action"
        placeholder="Filter by action"
        value={filters.action}
        onChange={handleInputChange}
      />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;
