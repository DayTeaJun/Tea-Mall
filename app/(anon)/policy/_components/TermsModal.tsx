import React, { useState } from "react";
import TermsComponent from "./TermsComponent";

const TermsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="text-14 border-b border-solid border-gray-300">
      <button className="" onClick={openModal} type="button">
        (보기)
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="flex flex-col justify-between bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] h-[60%] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">이용약관</h2>
            <div className="overflow-y-auto h-[80%] p-3 mb-4 text-sm text-gray-700 border-t border-solid border-gray-200">
              <TermsComponent />
            </div>
            <div className="flex justify-end">
              <button className="py-2 text-20 text-black" onClick={closeModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsModal;
