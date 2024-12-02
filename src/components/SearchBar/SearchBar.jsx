import React, { useState, useEffect, useRef } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js';
import _ from 'lodash';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // State to track suggestions
  const [showDropdown, setShowDropdown] = useState(false); // State to track dropdown menu 
  const navigate = useNavigate(); 
  const dropdownRef = useRef(null);

  // Fetch buildings from database
  useEffect(() => {
    const fetchBuildings = async () => {
      const buildingsCollection = collection(db, 'Buildings');
      const buildingsSnapshot = await getDocs(buildingsCollection);
      const buildingsList = buildingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBuildings(buildingsList);

      const fuseInstance = new Fuse(buildingsList, {
        keys: ['name'], 
        threshold: 0.3
      });
      setFuse(fuseInstance);
    };

    fetchBuildings();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = _.debounce((term) => {
    if (fuse && term) {
      const results = fuse.search(term);
      setSuggestions(results.map(result => result.item));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(term.length > 0); // Show dropdown with "No buildings found" if there's a search term
    }
  }, 300);

  // Handle search while typing 
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Click on a suggestion will set the search term to be that 
  const handleSuggestionClick = (buildingName) => {
    setSearchTerm(buildingName);
    setShowDropdown(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const building = await performSearch(searchTerm);
    if (building) {
      navigateToMapView(building);
    } else {
      alert('Building not found');
    }
  };

  const performSearch = async (term) => {
    if (fuse) {
      const results = fuse.search(term);
      if (results.length > 0) {
        return results[0].item;
      }
    }
    return null;
  };

  const navigateToMapView = (building) => {
    navigate('/map-view', { state: { building } });
  };

return (
    <div className="position-relative">
      <Form className="d-flex justify-content-center mb-3">
        <div style={{ width: '70%', display: 'flex' }}>
          <FormControl
            type="search"
            placeholder="Search for a building..."
            className="me-2"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(searchTerm.length > 0)}
            style={{ flexGrow: 1 }}/>
          <Button variant="primary" onClick={handleSearchSubmit}>
            Search
          </Button>
        </div>
      </Form>
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="position-absolute w-100"
          style={{
            zIndex: 1000,
            maxWidth: '70%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map(building => (
              <div
                key={building.id}
                onClick={() => handleSuggestionClick(building.name)}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eeeeee'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {building.name}
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '10px 15px',
                color: '#6c757d'
              }}> No buildings found </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;