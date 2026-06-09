export default function handler(req,res){res.status(200).json({ok:true,status:'online',maintenance:process.env.MAINTENANCE_MODE==='true',whatsapp:process.env.WHATSAPP_CHANNEL_URL||'#'});}
