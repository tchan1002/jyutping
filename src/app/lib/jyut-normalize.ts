// Normalize Jyutping; tones optional by default.
export function normalizeJyut(input: string, strict = false) {
    if (!input) return "";
    let s = input
      .toLowerCase()
      .trim()
      // remove any non-alphanumeric characters (e.g., *, ·, punctuation)
      // keep spaces and digits for tone handling
      .replace(/[^a-z0-9\s]/gi, " ")
      .replace(/\uFF10/g, "0")
      .replace(/\uFF11/g, "1")
      .replace(/\uFF12/g, "2")
      .replace(/\uFF13/g, "3")
      .replace(/\uFF14/g, "4")
      .replace(/\uFF15/g, "5")
      .replace(/\uFF16/g, "6")
      .replace(/\uFF17/g, "7")
      .replace(/\uFF18/g, "8")
      .replace(/\uFF19/g, "9")
      .replace(/\s+/g, " ");
  
    // Treat digit boundaries as syllable separators (supports jam2caa4 etc.)
    // Insert a space after each syllable digit (1-6) if followed by a letter.
    s = s.replace(/([1-6])(?=[a-z])/g, "$1 ");
  
    if (!strict) {
      // strip trailing tone digits on each syllable
      s = s
        .split(" ")
        .map((sy) => sy.replace(/([a-z]+?)[1-6]$/i, "$1"))
        .join(" ");
    }
    return s;
  }
  
  export function compareJyut(user: string, gold: string, strict = false) {
    const u = normalizeJyut(user, strict).replace(/\s+/g, " ").trim();
    const g = normalizeJyut(gold, strict).replace(/\s+/g, " ").trim();
  
    // Space-insensitive comparison so "ngozi" matches "ngo zi".
    return u.replace(/\s+/g, "") === g.replace(/\s+/g, "");
  }
  