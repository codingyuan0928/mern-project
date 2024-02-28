import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

const SearchComponent = (props) => {
  const {
    setInput,
    input,
    search,
    currentSearch,
    searchUrl,
    initialUrl,
    setCurrentSearch,
  } = props;

  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    if (input !== "") {
      setCurrentSearch(input);
      search(searchUrl);
      setInput("");
    }
  };

  return (
    <div>
      <form className="d-flex">
        <div className="input-group">
          <input
            className="form-controls"
            type="search"
            placeholder="搜尋"
            aria-label="Search"
            value={input}
            onChange={inputHandler}
          />
          <span
            className="input-group-text"
            id="search-icon"
            onClick={handleSearch}
          >
            <IoSearch />
          </span>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
