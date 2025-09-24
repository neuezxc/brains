import React from "react";
import { Settings, ArrowUp, Edit } from "lucide-react";

function index() {
  return (
    <div className="flex-1 flex flex-col gap-6 pt-10 w-full  overflow-y-scroll px-4">
      <div className="flex flex-col gap-8 sm:mx-[600px] md:mx-[300px] lg:mx-[300px] pb-[200px]">
        <div className="flex justify-end">
          <div className="bg-[#191318] rounded-md p-4">
            <p>Write me a script about Scarcity</p>
          </div>
        </div>
        <div className="brain flex flex-row gap-3 ">
          <div className="icon h-[50px] w-[50px] bg-pink-300/15 border border-pink-300 rounded-full flex items-center justify-center">
            <Edit size={19} className="text-pink-200" />
          </div>
          <div className="texts flex-1">
            <div className="brain-name font-medium mb-2">
              Content Scriptwriter
            </div>
            <div className="message opacity-90">
              Ever feel like you're constantly chasing something, but there's
              never enough time, money, or opportunities? That's scarcity
              messing with your head. Scarcity isn't just about being broke or
              busy. It's a mindset that traps you. When you focus on what you
              lack, your brain panics. You make short-term, bad decisions,
              creating a cycle where you never get ahead. The solution is to
              shift your focus from scarcity to abundance. Abundance isn't about
              having everything; it's a mindset of recognizing the opportunities
              and resources you already have. Instead of thinking, "I don't have
              time to go to the gym," flip it. Think, "I have exactly 10
              minutes. I can use that to do a quick home workout." You shifted
              from a scarce resource (time) to an abundant action (a workout).
              Scarcity is a lens that distorts your reality. Change the lens.
              Focus on what you can do with what you have. True wealth is a
              mindset of abundance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
