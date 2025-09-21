import axios from "axios";

export const handleResponse = async (message: string): Promise<string> => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/plan",
      { question: message },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data;
    console.log("Server response:", data);
    if (typeof data === "string") return data;
    if (data?.answer) return data.answer;
    if (data?.message) return data.message;

    return "⚠️ Sorry, I couldn't understand the server response.";
  } catch (err: any) {
    console.error("handleResponse error:", err.message);
    return "⚠️ Server error. Please try again.";
  }
};
