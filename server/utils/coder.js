export function encodeMessage(data) {
  const str = JSON.stringify(data);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeInt32LE(str.length, 0);
  const strBuf = Buffer.from(str, 'utf8');
  return Buffer.concat([lenBuf, strBuf]);
}

export function decodeMessage(data) {
  const buffer = Buffer.from(data);
  const length = buffer.readInt32LE(0);
  const str = buffer.toString('utf8', 4, length + 4);

  const obj = JSON.parse(str);
  return obj;
}
