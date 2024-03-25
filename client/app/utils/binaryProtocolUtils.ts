export function encodeMessage(data: Object): Buffer {
  const str = JSON.stringify(data);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeInt32LE(str.length, 0);
  const strBuf = Buffer.from(str, 'utf8');
  return Buffer.concat([lenBuf, strBuf]);
}

export function decodeMessage(data: ArrayBuffer) {
  const buffer = new Uint8Array(data);
  const view = new DataView(buffer.buffer);
  const length = view.getInt32(0, true);
  const str = Buffer.from(buffer.buffer).toString('utf8', 4, length + 4);
  let obj = JSON.parse(str)
  return obj;
}
