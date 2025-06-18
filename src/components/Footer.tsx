
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-gray-400">
            © {currentYear} Alex Johnson. All rights reserved. Built with React & Tailwind CSS.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Designed and developed with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
