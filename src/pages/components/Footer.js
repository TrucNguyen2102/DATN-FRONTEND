const Footer = () => {
    return (
      <footer className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="container mx-auto text-center">
          <p className="text-xl">
            © {new Date().getFullYear()} NTT BILLIARDS
          </p>
          {/* <div className="flex justify-center mt-2 space-x-4">
            <a href="/terms" className="text-white hover:text-gray-400">
              Điều Khoản
            </a>
            <a href="/privacy" className="text-white hover:text-gray-400">
              Chính Sách Riêng Tư
            </a>
            <a href="/contact" className="text-white hover:text-gray-400">
              Liên Hệ
            </a>
          </div> */}
        </div>
      </footer>
    );
  };
  
  export default Footer;
  