import React from 'react';
import styles from './UpdateBanner.module.css';

interface UpdateBannerProps {
  needRefresh: boolean;
  setNeedRefresh?: (value: boolean) => void;
  updateServiceWorker: () => void;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({ needRefresh, setNeedRefresh, updateServiceWorker }) => {
  if (!needRefresh) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <span className={styles.text}>Update available</span>
      <button className={styles.button} onClick={() => updateServiceWorker()}>
        Reload
      </button>
      {setNeedRefresh && (
        <button className={styles.dismiss} onClick={() => {
          setNeedRefresh(false);
        }}>
          ✕
        </button>
      )}
    </div>
  );
};

export default UpdateBanner;