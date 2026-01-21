import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import DesignInfoView from './DesignInfoView';

const DesignInfo = ({ item }) => {
  const {
    title,
    type,
    images = [],
    dimensions,
    comment,
    _id,
  } = item;

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('/auth/user')
      .then((res) => setUser(res.data));
  }, []);

  const canDeleteImages =
    ['admin', 'designer'].includes(user?.role);

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;

    await axios.delete(
      `/design-items/${_id}/images/${imageId}`
    );

    window.location.reload();
  };

  return (
    <DesignInfoView
      title={title}
      type={type}
      images={images}
      dimensions={dimensions}
      comment={comment}
      canDeleteImages={canDeleteImages}
      onDeleteImage={handleDeleteImage}
    />
  );
};

export default DesignInfo;
