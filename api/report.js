import nodemailer from 'nodemailer';
function fail(res,code,msg){return res.status(code).json({ok:false,status:code,error:msg});}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(process.env.MAINTENANCE_MODE==='true')return fail(res,505,'Maintenance mode is active');
  if(req.method!=='POST')return fail(res,405,'Method not allowed');
  const {name,email,message}=req.body||{};
  if(!name||!email||!message)return fail(res,400,'Name, email, and message are required');
  if(!/^\S+@\S+\.\S+$/.test(email))return fail(res,400,'Invalid email');
  try{
    if(!process.env.SMTP_USER||!process.env.SMTP_PASS||!process.env.OWNER_EMAIL)return fail(res,500,'SMTP env is not configured');
    const transporter=nodemailer.createTransport({service:'gmail',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
    const safe=s=>String(s).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
    await transporter.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:process.env.OWNER_EMAIL,replyTo:email,subject:'ClipNova Report Error',html:`<div style="font-family:Arial;padding:20px;background:#0b1020;color:#fff;border-radius:16px"><h2>ClipNova Report</h2><p><b>Nama:</b> ${safe(name)}</p><p><b>Email:</b> ${safe(email)}</p><p><b>Pesan:</b></p><pre style="white-space:pre-wrap;background:#111a33;padding:14px;border-radius:12px">${safe(message)}</pre></div>`});
    return res.status(200).json({ok:true,message:'Report sent'});
  }catch(e){return fail(res,500,e.message||'Failed to send report');}
}
