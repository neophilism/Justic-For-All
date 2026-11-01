import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectEditorialImage} from '../scripts/lib/editorial-upload.mjs';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGP4DwQACfsD/fteaysAAAAASUVORK5CYII=','base64');
const jpeg=Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==','base64');
function crc(b){let n=0xffffffff;for(const v of b){n^=v;for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;}return (n^0xffffffff)>>>0;}
function chunk(type,data){const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4,'latin1');data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
test('valid bounded PNG and JPEG pass structural preflight',()=>{
 assert.equal(inspectEditorialImage(png,'image/png').size,png.length);
 assert.equal(inspectEditorialImage(jpeg,'image/jpeg').size,jpeg.length);
});
test('PNG rejects checksum corruption, truncated chunks and fake signature-only wrappers',()=>{
 const bad=Buffer.from(png);bad[45]^=1;assert.throws(()=>inspectEditorialImage(bad,'image/png'),/checksum/);
 for(const b of [png.subarray(0,-1),Buffer.concat([png.subarray(0,33),png.subarray(-12)]),Buffer.concat([png,Buffer.from('trailing')])])assert.throws(()=>inspectEditorialImage(b,'image/png'),/structure/);
});
test('PNG metadata including EXIF and active animation chunks are rejected',()=>{
 for(const name of ['eXIf','tEXt','iTXt','zTXt','acTL','fdAT']){
  const b=Buffer.concat([png.subarray(0,33),chunk(name,Buffer.from('private location')),png.subarray(33)]);
  assert.throws(()=>inspectEditorialImage(b,'image/png'),/metadata|extension/);
 }
});
test('PNG checks actual dimensions even when attacker supplies a correct CRC',()=>{
 const header=Buffer.from(png.subarray(16,29));header.writeUInt32BE(10001);
 assert.throws(()=>inspectEditorialImage(Buffer.concat([png.subarray(0,8),chunk('IHDR',header),png.subarray(33)]),'image/png'),/dimensions/);
});
test('JPEG rejects EXIF, comments, truncated segments and trailing bytes',()=>{
 for(const marker of [0xe1,0xed,0xfe]){
  const data=Buffer.from('Exif\0\0location'),segment=Buffer.alloc(data.length+4);segment[0]=255;segment[1]=marker;segment.writeUInt16BE(data.length+2,2);data.copy(segment,4);
  assert.throws(()=>inspectEditorialImage(Buffer.concat([jpeg.subarray(0,2),segment,jpeg.subarray(2)]),'image/jpeg'),/metadata/);
 }
 for(const b of [jpeg.subarray(0,-1),Buffer.concat([jpeg,Buffer.from('extra')]),Buffer.from([255,216,...Array(22).fill(0),255,217])])assert.throws(()=>inspectEditorialImage(b,'image/jpeg'),/structure|extension/);
});
test('JPEG frame dimensions are bounded before scanning or decoding',()=>{
 const b=Buffer.from(jpeg),at=b.indexOf(Buffer.from([255,192]));assert.ok(at>0);b.writeUInt16BE(10001,at+7);
 assert.throws(()=>inspectEditorialImage(b,'image/jpeg'),/dimensions/);
});
