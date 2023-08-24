// Add more from http://en.wikipedia.org/wiki/List_of_file_signatures
// Not using this at the moment
export function validateFileType(headerString: string) {
  const hs = headerString.toLowerCase();
  if (hs.startsWith('89504e47')) return 'png';
  if (hs.startsWith('47494638')) return 'gif';
  if (hs.startsWith('ffd8ffe0')) return 'jpg';
  if (hs.startsWith('ffd8ffe1')) return 'jpg';
  if (hs.startsWith('ffd8ffe2')) return 'jpeg';
  if (hs.startsWith('ffd8ffdb')) return 'pdf';
  if (hs.startsWith('49443303')) return 'mp3';
  if (hs.startsWith('fffbfff3fff2')) return 'mp3';
  else return 'unsupported';
}