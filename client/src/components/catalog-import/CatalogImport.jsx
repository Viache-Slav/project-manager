import { useState } from 'react';
import axios from '../../api/axios';
import CatalogImportView from './CatalogImportView';

const CatalogImport = () => {
  const [brand, setBrand] = useState('Davis');
  const [collection, setCollection] = useState('');
  const [techZip, setTechZip] = useState(null);
  const [imagesZip, setImagesZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!collection || !techZip || !imagesZip) {
      setMessage('Fill all fields and upload files');
      return;
    }

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('collectionName', collection);
    formData.append('techZip', techZip);
    formData.append('imagesZip', imagesZip);

    try {
      setLoading(true);

      await axios.post(
        '/catalog-import/davis',
        formData
      );

      setMessage('Catalog imported successfully');
      setCollection('');
      setTechZip(null);
      setImagesZip(null);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          'Import failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatalogImportView
      brand={brand}
      collection={collection}
      loading={loading}
      message={message}
      onBrandChange={(e) =>
        setBrand(e.target.value)
      }
      onCollectionChange={(e) =>
        setCollection(e.target.value)
      }
      onTechZipChange={(e) =>
        setTechZip(e.target.files[0])
      }
      onImagesZipChange={(e) =>
        setImagesZip(e.target.files[0])
      }
      onSubmit={submit}
    />
  );
};

export default CatalogImport;
