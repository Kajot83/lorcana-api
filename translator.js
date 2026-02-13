import axios from "axios";

export default async function translate(text) {
  if (!text) return "";

  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pl&dt=t&q=${encodeURIComponent(text)}`
    );

    return res.data[0].map(t => t[0]).join("");
  } catch {
    return text;
  }
}
