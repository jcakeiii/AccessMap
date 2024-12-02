import NavBar from "../../components/NavBar/NavBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import React, { useState, useEffect, useRef } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js';
import _ from 'lodash';

const ContributeWhatView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); 
  const dropdownRef = useRef(null);

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
      navigateToContributeView(building);
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

  const navigateToContributeView = (building) => {
    navigate('/contribute-form', { state: { building } });
  };

  return ( 
    <div className="position-relative" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar/>  
      <div className="d-flex justify-content-center align-items-center flex-column" style={{ flexGrow: 1 }}>
        <h2 className="mb-4 text-center">Which building would you like to contribute to?</h2>
        <Form className="d-flex justify-content-center mb-3" style={{ width: '100%', maxWidth: '500px' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <FormControl
              type="search"
              placeholder="Search for a building..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
              style={{ flexGrow: 1, padding: '0.5rem' }}/>
            <Button variant="primary" onClick={handleSearchSubmit}>
              Search
            </Button>
          </div>
        </Form>
          <p className="my-3">OR</p>
          <Link to="/submit-building"><Button variant="warning">Add a New Building</Button></Link>
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="position-absolute w-100"
            style={{
              zIndex: 1000,
              maxWidth: '500px', // Matching max width of search bar
              backgroundColor: 'white',
              border: '1px solid #ced4da',
              borderRadius: '0.25rem',
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
                }}
              >
                No buildings found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributeWhatView;