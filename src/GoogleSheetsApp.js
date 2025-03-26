import React, { useState, useEffect, useCallback } from 'react';
import supabase from './supabaseClient';
import debounce from 'lodash.debounce';
import './GoogleSheetsApp.css';

const SupabaseApp = () => {
  // Mevcut durumlar
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Yeni kayıt eklemek için durumlar
  const [newName, setNewName] = useState('');
  const [newStok, setNewStok] = useState('');

  // Supabase'den veri çekme
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: fetchedData, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setData(fetchedData || []);
      setFilteredData(fetchedData || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Veri çekilirken bir hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debounce kullanarak arama işlemi (300ms gecikme)
  const debouncedFilter = useCallback(
    debounce((searchVal, data) => {
      if (!searchVal) {
        setFilteredData(data);
      } else {
        const filtered = data.filter((row) =>
          Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFilter(searchTerm, data);
  }, [searchTerm, data, debouncedFilter]);

  // Sıralanmış veriyi hesaplama
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Yeni kayıt ekleme işlemi
  const handleAddRecord = async () => {
    if (!newName || !newStok) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      const quantity = parseInt(newStok, 10);
      const { error } = await supabase.from('products').insert([{ name: newName, quantity: quantity }]);
      if (error) throw error;
      // Alanları temizle ve listeyi güncelle
      setNewName('');
      setNewStok('');
      fetchData();
    } catch (err) {
      alert(err.message || 'Ekleme sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="app-container">
      <h1 className="title">Supabase Verileri</h1>

      {/* Yeni kayıt ekleme formu */}
      <div className="add-form">
        <input
          type="text"
          placeholder="Ürün Adı"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="add-input"
        />
        <input
          type="number"
          placeholder="Stok"
          value={newStok}
          onChange={(e) => setNewStok(e.target.value)}
          className="add-input"
        />
        <button onClick={handleAddRecord} className="add-button">
          Ekle
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={handleRefresh} className="refresh-button">
          Yenile
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0]).map((header, index) => (
                <th
                  key={index}
                  onClick={() => requestSort(header)}
                  className="table-header"
                >
                  {header}
                  {sortConfig.key === header
                    ? sortConfig.direction === 'ascending'
                      ? ' ▲'
                      : ' ▼'
                    : null}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div className="no-results">Sonuç bulunamadı.</div>
      )}
    </div>
  );
};

export default SupabaseApp;
