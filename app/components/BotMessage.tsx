import { RiRobot3Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useState } from "react";

// Simple non-English detection (expandable)
const isNonEnglish = (text: string) => /[^\u0000-\u007f]/.test(text);

interface BotMessageProps {
  botMessage: string;
}

const BotMessage = ({ botMessage }: BotMessageProps) => {
  const date = new Date();
  const [showEnglish, setShowEnglish] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);

  const handleTranslate = async () => {
    try {
      // Quick inline translation using Google Translate endpoint
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
          botMessage
        )}`
      );
      const data = await res.json();
      console.log("Translation data:", data);

      setTranslated(data[0][0][0]); // Extract translation
      setShowEnglish(true);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full my-3 items-start gap-3"
    >
      <div className="flex justify-center items-center w-10 h-10 border-2 border-emerald-400 bg-slate-800 rounded-full shadow-lg">
        <RiRobot3Line size={24} className="text-emerald-400" />
      </div>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="inline-block rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-lg text-white max-w-[75%] break-words shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="prose prose-invert">
          <ReactMarkdown>
            {showEnglish && translated ? translated : botMessage}
          </ReactMarkdown>
        </div>

        {/* Translate link if not English */}
        {isNonEnglish(botMessage) && !showEnglish && (
          <div className="text-right mt-2">
            <button
              onClick={handleTranslate}
              className="text-xs text-yellow-300 underline hover:text-yellow-200"
            >
              Translate to English
            </button>
          </div>
        )}

        <div className="text-right mt-2">
          <span className="text-xs text-white/80">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BotMessage;
