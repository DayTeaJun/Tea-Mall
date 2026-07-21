import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import ChattingModal from "../../chat/ChattingModal";

function ChattingBtn() {
  const [isChatting, setIsChatting] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsChatting(!isChatting)}
        type="button"
        className="p-3 bg-gray-200 rounded-full text-gray-500"
      >
        <MessageCircle size={25} />
      </button>

      {isChatting && <ChattingModal onClose={() => setIsChatting(false)} />}
    </div>
  );
}

export default ChattingBtn;
