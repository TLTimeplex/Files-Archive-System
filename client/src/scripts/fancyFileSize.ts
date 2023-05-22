export const FancyFileSize = (size: number): string => {
  if (size < 0) return "Negative size!";
  else if (size < Math.pow(1000, 1)) return size + " B";
  else if (size < Math.pow(1000, 2)) return Math.round(size / Math.pow(1000, 1) * 10) / 10 + " KB";
  else if (size < Math.pow(1000, 3)) return Math.round(size / Math.pow(1000, 2) * 10) / 10 + " MB";
  else if (size < Math.pow(1000, 4)) return Math.round(size / Math.pow(1000, 3) * 10) / 10 + " GB";
  else if (size < Math.pow(1000, 5)) return Math.round(size / Math.pow(1000, 4) * 10) / 10 + " TB";
  else if (size < Math.pow(1000, 6)) return Math.round(size / Math.pow(1000, 5) * 10) / 10 + " PB";
  else if (size < Math.pow(1000, 7)) return Math.round(size / Math.pow(1000, 6) * 10) / 10 + " EB";
  else if (size < Math.pow(1000, 8)) return Math.round(size / Math.pow(1000, 7) * 10) / 10 + " ZB";
  else if (size < Math.pow(1000, 9)) return Math.round(size / Math.pow(1000, 8) * 10) / 10 + " YB";
  else return "The Universe!";
}

export default FancyFileSize;