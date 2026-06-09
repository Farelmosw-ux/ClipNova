const allowed={tiktok:'tiktok',instagram:'ig',pinterest:'pinterest',facebook:'fb',spotify:'spotify','youtube-mp3':'ytmp3','youtube-mp4':'ytmp4'};
function fail(res,code,msg){return res.status(code).json({ok:false,status:code,error:msg});}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(process.env.MAINTENANCE_MODE==='true')return fail(res,505,'Maintenance mode is active');
  if(req.method!=='POST')return fail(res,405,'Method not allowed');
  const {service,url,bitrate,resolution}=req.body||{};
  if(!service||!allowed[service])return fail(res,400,'Invalid downloader service');
  if(!url||typeof url!=='string'||!/https?:\/\//i.test(url))return fail(res,400,'Valid URL is required');
  try{
    const base=(process.env.API_BASE||'https://api.theresav.biz.id/download').replace(/\/$/,'');
    const apikey=process.env.API_KEY||'Hcmoa';
    const u=new URL(`${base}/${allowed[service]}`);
    u.searchParams.set('url',url);
    u.searchParams.set('apikey',apikey);
    if(service==='youtube-mp3'){u.searchParams.set('format','mp3');u.searchParams.set('bitrate', ['64k','128k','192k','256k','320k'].includes(bitrate)?bitrate:'128k');}
    if(service==='youtube-mp4'){u.searchParams.set('resolution', ['360','480','720','1080','1440','2160'].includes(String(resolution))?String(resolution):'720');}
    const r=await fetch(u.toString(),{headers:{'User-Agent':'ClipNova/2.0'}});
    const text=await r.text();
    let data;try{data=JSON.parse(text)}catch{data={raw:text}}
    if(!r.ok)return fail(res,r.status,data?.message||data?.error||'Provider API error');
    return res.status(200).json({ok:true,service,provider_status:r.status,data});
  }catch(e){return fail(res,500,e.message||'Internal server error');}
}
