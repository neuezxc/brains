import { Settings, ArrowUp, Edit } from "lucide-react";

import Chats from "./components/Chats";
import SuperInput from "./components/SuperInput";
export default function Home() {
  return (
    <div className="h-screen bg-[var(--background)]">
      <div className="chat-body h-full flex items-center flex-col gap-2 relative">
        <Chats />
        <SuperInput />
      </div>
    </div>
  );
}
