function Footer() {
  return (
    <footer className="w-full border-t bg-white py-2">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
        <div className="text-center md:text-left">
          <p className="font-semibold text-lg text-gray-800">Tea Mall</p>
          <p className="text-xs mt-1">당신의 하루를 따뜻하게, 티몰과 함께</p>
        </div>

        <div className="text-xs text-gray-500 text-center md:text-right">
          <p>
            &copy; {new Date().getFullYear()} Tea Mall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
