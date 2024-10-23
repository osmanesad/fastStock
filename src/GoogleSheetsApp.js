import React, { useState, useEffect, useCallback } from 'react';
import { GoogleLogin } from 'react-google-login';

const SHEET_ID = '1lbxgwy4MAWow2EMb0d4d6hUT2oxKktlxCv8kmFYxveg';
const CLIENT_ID = '778287158950-0ant4igtvapakni3comu4hkn0hms5hud.apps.googleusercontent.com'; // Buraya kendi Client ID'nizi yazın

const GoogleSheetsApp = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [newProduct, setNewProduct] = useState({
    barcode: '',
    title: '',
    author: '',
    publisher: '',
    price: '',
    category: '',
  });

  const fetchData = useCallback(async () => {
    if (!accessToken) return; // Erişim belirteci yoksa veri çekme

    setLoading(true);
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sayfa1!A1:Z999?access_token=${accessToken}`
      );
      const result = await response.json();

      // Eğer response ok değilse hata durumu
      if (!response.ok) {
        console.error('API isteği başarısız:', response);
        throw new Error(result.error.message || 'Veri çekilirken bir hata oluştu');
      }

      setData(result.values || []);
      setFilteredData(result.values?.slice(1) || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Veri çekilirken bir hata oluştu');
      setLoading(false);
    }
  }, [accessToken]);


  

  useEffect(() => {
    fetchData();
  }, [accessToken, fetchData]);

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

  const handleAddProduct = async () => {
    const values = [
      newProduct.barcode,
      newProduct.title,
      newProduct.author,
      newProduct.publisher,
      newProduct.price,
      newProduct.category,
    ];

    const body = {
      range: "Sayfa1!A1",
      majorDimension: "ROWS",
      values: [values],
    };

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sayfa1!A1:append?valueInputOption=RAW&access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Ürün eklenirken bir hata oluştu:', errorMessage);
        setError('Ürün eklenirken bir hata oluştu');
        return;
      }

      setNewProduct({
        barcode: '',
        title: '',
        author: '',
        publisher: '',
        price: '',
        category: '',
      });
      fetchData(); // Yenile
    } catch (error) {
      console.error('Ürün eklenirken bir hata oluştu:', error);
      setError('Ürün eklenirken bir hata oluştu');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const onSuccess = (response) => {
    setAccessToken(response.accessToken); // Erişim belirtecini kaydet
    fetchData(); // Başarılı giriş sonrası verileri çek
  };

  const onFailure = (response) => {
    console.error('Giriş başarısız:', response);
    setError('Giriş başarısız. Lütfen tekrar deneyin.');
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Google Sheets Verileri</h1>

      {/* Google Giriş */}
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Google ile Giriş Yap"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />

      {/* Yeni ürün ekleme formu */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Yeni Ürün Ekle</h2>
        <input type="text" name="barcode" placeholder="Barkod" value={newProduct.barcode} onChange={handleInputChange} />
        <input type="text" name="title" placeholder="Kitap Adı" value={newProduct.title} onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Yazar" value={newProduct.author} onChange={handleInputChange} />
        <input type="text" name="publisher" placeholder="Yayın Evi" value={newProduct.publisher} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Fiyat" value={newProduct.price} onChange={handleInputChange} />
        <input type="text" name="category" placeholder="Kategori" value={newProduct.category} onChange={handleInputChange} />
        <button onClick={handleAddProduct}>Ekle</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button onClick={handleRefresh} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Yenile
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {data[0]?.map((header, index) => (
              <th key={index} style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '12px' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Sonuç bulunamadı.</div>
      )}
    </div>
  );
};

export default GoogleSheetsApp;
