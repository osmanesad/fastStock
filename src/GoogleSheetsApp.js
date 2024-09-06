import React, { useState, useEffect } from 'react';

const SHEET_ID = 'XXXXX';

const API_KEY = 'XXXXX';

const GoogleSheetsApp = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:Z1000?key=${API_KEY}`
      );
      const result = await response.json();
      setData(result.values || []);
      setFilteredData(result.values?.slice(1) || []);
      setLoading(false);
    } catch (err) {
      setError('Veri çekilirken bir hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.slice(1).filter(row =>
      row.some(cell =>
        cell.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Yükleniyor...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center'}}>{error}</div>;

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Google Sheets Verileri</h1>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={handleSearch}
          style={{padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
        <button onClick={handleRefresh} style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
          Yenile
        </button>
      </div>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            {data[0]?.map((header, index) => (
              <th key={index} style={{border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2'}}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{border: '1px solid #ddd', padding: '12px'}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredData.length === 0 && (
        <div style={{textAlign: 'center', marginTop: '20px'}}>Sonuç bulunamadı.</div>
      )}
    </div>
  );
};

export default GoogleSheetsApp;
