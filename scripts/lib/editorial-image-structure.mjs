// Bounded structural checks, not a decoder, sanitizer or malware scanner.
const maxDimension=10000,maxPixels=40000000;
const crcTable=Uint32Array.from({length:256},(_,i)=>{
 let n=i;for(let j=0;j<8;j++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;
});
function crc32(bytes){let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
function dimensions(width,height){
 if(!width||!height||width>maxDimension||height>maxDimension||width*height>maxPixels)throw new Error('Image dimensions exceed limits');
}
export function inspectPngStructure(bytes){
 let offset=8,chunks=0,idat=false,idatBytes=0,idatEnded=false,palette=0,transparency=false,color;
 while(offset<bytes.length){
  if(++chunks>4096||bytes.length-offset<12)throw new Error('Invalid PNG structure');
  const size=bytes.readUInt32BE(offset),end=offset+12+size;
  if(end>bytes.length)throw new Error('Invalid PNG structure');
  const type=bytes.toString('latin1',offset+4,offset+8),data=bytes.subarray(offset+8,offset+8+size);
  if(crc32(bytes.subarray(offset+4,end-4))!==bytes.readUInt32BE(end-4))throw new Error('Invalid PNG checksum');
  if(chunks===1&&type!=='IHDR')throw new Error('Invalid PNG structure');
  if(type==='IHDR'){
   if(chunks!==1||size!==13)throw new Error('Invalid PNG structure');
   dimensions(data.readUInt32BE(0),data.readUInt32BE(4));
   const depth=data[8];color=data[9];
   const depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
   if(!depths[color]?.includes(depth)||data[10]!==0||data[11]!==0||data[12]>1)throw new Error('Unsupported PNG encoding');
  }else if(type==='PLTE'){
   if(palette||idat||size===0||size>768||size%3!==0||[0,4].includes(color))throw new Error('Invalid PNG palette');
   palette=size/3;
  }else if(type==='IDAT'){
   if(idatEnded||color===3&&!palette)throw new Error('Invalid PNG structure');
   idat=true;idatBytes+=size;
  }else if(type==='IEND'){
   if(size!==0||!idat||!idatBytes||end!==bytes.length)throw new Error('Invalid PNG structure');
   return;
  }else if(type==='tRNS'){
   if(transparency||idat||![0,2,3].includes(color)||color===0&&size!==2||color===2&&size!==6||color===3&&(!palette||size<1||size>palette))throw new Error('Invalid PNG transparency');
   transparency=true;
  }else{
   // Metadata and active/unknown extensions are rejected rather than exposed.
   throw new Error('Unsupported PNG metadata or extension');
  }
  if(idat&&type!=='IDAT')idatEnded=true;
  offset=end;
 }
 throw new Error('Invalid PNG structure');
}
export function inspectJpegStructure(bytes){
 let offset=2,frames=0,scans=0,components=0,segments=0;
 while(offset<bytes.length){
  if(++segments>4096||bytes[offset++]!==255)throw new Error('Invalid JPEG structure');
  while(bytes[offset]===255)offset++;
  const marker=bytes[offset++];
  if(marker===0xd9){if(frames!==1||scans<1||offset!==bytes.length)throw new Error('Invalid JPEG structure');return;}
  if(offset+2>bytes.length)throw new Error('Invalid JPEG structure');
  const size=bytes.readUInt16BE(offset),end=offset+size;
  if(size<2||end>bytes.length)throw new Error('Invalid JPEG structure');
  const data=bytes.subarray(offset+2,end);
  if(marker===0xc0||marker===0xc2){
   if(++frames!==1||scans||data.length<6||data[0]!==8)throw new Error('Invalid JPEG frame');
   dimensions(data.readUInt16BE(3),data.readUInt16BE(1));
   components=data[5];if(![1,3,4].includes(components)||size!==8+3*components)throw new Error('Invalid JPEG frame');
  }else if(marker===0xda){
   if(frames!==1||data.length<4||data[0]<1||data[0]>components||size!==6+2*data[0])throw new Error('Invalid JPEG scan');
   scans++;offset=end;const start=offset;
   while(offset<bytes.length){
    if(bytes[offset]!==255){offset++;continue;}
    let next=offset+1;while(bytes[next]===255)next++;
    if(bytes[next]===0||bytes[next]>=0xd0&&bytes[next]<=0xd7){offset=next+1;continue;}
    break;
   }
   if(offset===start)throw new Error('Invalid JPEG scan');
   continue;
  }else if(marker===0xe0){
   if(data.length!==14||data.toString('latin1',0,5)!=='JFIF\0'||data[12]!==0||data[13]!==0)throw new Error('Unsupported JPEG metadata');
  }else if(marker===0xee){
   if(data.length!==12||data.toString('latin1',0,5)!=='Adobe')throw new Error('Unsupported JPEG metadata');
  }else if(![0xdb,0xc4,0xdd].includes(marker)){
   throw new Error('Unsupported JPEG metadata or extension');
  }
  offset=end;
 }
 throw new Error('Invalid JPEG structure');
}
