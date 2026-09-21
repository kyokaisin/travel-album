// Maximum file size in decimal bytes: 500 KB, not a fixed output size.
export const PHOTO_MAX_BYTES=500000;
export async function compressPhoto(image,makeCanvas=()=>document.createElement('canvas')){
  const originalWidth=image.naturalWidth,originalHeight=image.naturalHeight;
  if(!originalWidth||!originalHeight)throw Error('无法读取照片尺寸');
  let edge=Math.min(1800,Math.max(originalWidth,originalHeight));
  const canvas=makeCanvas();
  try{
    for(let attempt=0;attempt<12;attempt++){
      const scale=Math.min(1,edge/Math.max(originalWidth,originalHeight));
      canvas.width=Math.max(1,Math.round(originalWidth*scale));
      canvas.height=Math.max(1,Math.round(originalHeight*scale));
      const ctx=canvas.getContext('2d');
      if(!ctx)throw Error('浏览器无法处理照片');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
      const encode=q=>new Promise((resolve,reject)=>canvas.toBlob(b=>b&&b.type==='image/jpeg'?resolve(b):reject(Error('照片压缩失败，请尝试 JPEG 原图')),'image/jpeg',q));
      let blob=await encode(.88);
      if(blob.size<=PHOTO_MAX_BYTES)return blob;
      let best=await encode(.5);
      if(best.size<=PHOTO_MAX_BYTES){
        let low=.5,high=.88;
        for(let i=0;i<5;i++){const quality=(low+high)/2;blob=await encode(quality);if(blob.size<=PHOTO_MAX_BYTES){best=blob;low=quality;}else high=quality;}
        return best;
      }
      if(edge<=160)break;
      edge=Math.max(160,Math.floor(edge*.75));
    }
    throw Error('无法压缩到 500 KB，请先缩小原图后重试');
  }finally{canvas.width=canvas.height=1;}
}
