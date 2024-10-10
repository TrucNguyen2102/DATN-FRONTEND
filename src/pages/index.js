// pages/index.js
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';

const HomePage = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Chuyển hướng đến trang đăng nhập
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>PHẦN MỀM KINH DOANH DỊCH VỤ GIẢI TRÍ BIDA</h1>
        <button onClick={handleButtonClick} className={styles.button}>KHÁM PHÁ NGAY</button>
      </div>
    </div>
  );
};

export default HomePage;
