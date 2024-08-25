"use client";

import React, { useState, useEffect, useRef } from "react";

interface ISkill {
  id: string;
  name: string;
  updateAt: string;
  createdAt: string;
  createdBy: string;
}

export default function TopHeader() {
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ISkill[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        search(query);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const search = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://dev-api.divetalent.com/user-service/skill/search/${query}?limit=10&offset=0`
      );
      const data = await response.json();
      setResults(data.results);
      setTotalResults(data.totalResults || 0);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index: number) => {
    const selectedItem = results[index];
    alert(`Selected Item: ${selectedItem.name}, ID: ${selectedItem.id}`);
    setShowDropdown(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, results.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(selectedIndex);
    }
  };

  return (
    <header className="w-full relative">
      <div className="flex w-full items-center bg-gray-100 text-gray-900 shadow rounded-lg p-2 h-12">
        <input
          type="text"
          ref={searchInput}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 focus:outline-none"
          placeholder="Search..."
        />
      </div>
      {/* results overlay */}
      {showDropdown && (
        <div className="absolute bg-gray-100 text-gray-900 shadow-xl rounded-lg p-2 w-full mt-2 z-10 font-semibold">
          {loading ? (
            <div className="p-2">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li
                  key={result.id}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    index === selectedIndex ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  {result.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2">No results found</div>
          )}
        </div>
      )}
    </header>
  );
}
