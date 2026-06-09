export default function handler(req,res){res.status(404).json({ok:false,status:404,error:'API route not found',path:req.url});}
