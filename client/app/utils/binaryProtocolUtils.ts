//utils
export function encodeMessage(data: Object) {
  const str = JSON.stringify(data);
  const buf = Buffer.from(str, "utf8");
  return buf
}

export function decodeMessage(data: string) {
  const buffer = Buffer.from(data);
  const str = buffer.toString('utf8');
  const obj = JSON.parse(str);

  return obj
}