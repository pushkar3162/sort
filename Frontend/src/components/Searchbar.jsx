import React from "react";

const Searchbar = () => {
  return (
    <div className="input-group w-50 positon-relative start-50  max-w-xl">
      <input
        type="search"
        className="form-control border border-secondary w-25"
        placeholder="Search"
        aria-label="Search"
      />
    </div>
  );
};

export default Searchbar;
