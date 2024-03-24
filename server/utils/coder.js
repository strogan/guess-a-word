//utils
export function encodeMessage(data) {
    const str = JSON.stringify(data);
    const buf = Buffer.from(str, "utf8");
    return buf
  }
  
  export function decodeMessage(data) {
    const buffer = Buffer.from(data.data);
    const str = buffer.toString('utf8');
    const obj = JSON.parse(str);
  
    return obj
  }