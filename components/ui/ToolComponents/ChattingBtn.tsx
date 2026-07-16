import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import Chatting from "./Chatting";

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

      {isChatting && <Chatting onClose={() => setIsChatting(false)} />}
    </div>
  );
}

export default ChattingBtn;
