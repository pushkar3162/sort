import React from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const Filters = ({ filters, setFilters, applyFilters, clearFilters, logs }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const userSuggestions = logs
    .map((log) => log.username)
    .filter((user, index, self) => user.toLowerCase().startsWith(filters.user.toLowerCase()) && self.indexOf(user) === index);

  const actionSuggestions = logs
    .map((log) => log.action)
    .filter((action, index, self) => action.toLowerCase().startsWith(filters.action.toLowerCase()) && self.indexOf(action) === index);

  return (
    <div className="filters">
      <input
        type="text"
        name="user"
        placeholder="Filter by user"
        value={filters.user}
        onChange={handleInputChange}
        list="userSuggestions"
      />
      <datalist id="userSuggestions">
        {userSuggestions.map((user, index) => (
          <option key={index} value={user} />
        ))}
      </datalist>

      <input
        type="text"
        name="action"
        placeholder="Filter by action"
        value={filters.action}
        onChange={handleInputChange}
        list="actionSuggestions"
      />
      <datalist id="actionSuggestions">
        {actionSuggestions.map((action, index) => (
          <option key={index} value={action} />
        ))}
      </datalist>

      <button onClick={applyFilters} className="filter-btn">
        <FaFilter /> Apply
      </button>
      <button onClick={clearFilters} className="clear-btn">
        <FaTimes /> Clear
      </button>
    </div>
  );
};

export default Filters;
