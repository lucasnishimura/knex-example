const connection = require('../../database/connection');
const filter = require('knex-filter').filter;
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')

module.exports = {
  async index(req,res){
    try{
      const [ count ] = await connection('funcionarios').count().where('email',req.body.email);
      const funcionario  = await connection('funcionarios')
      .select([
          'funcionarios.*',
      ])
      .where('email',req.body.email)

      if(count.count == 0 || count['count(*)'] == 0){
        return res.status(404).json({error: '', text: 'Email ou senha incorretos'})
      }
      
      res.header('X-Total-Count', count['count(*)']);
      const decrypt = CryptoJS.AES.decrypt(funcionario[0].senha, process.env.PASSWORD_SECRET)
      const passwordDB = decrypt.toString(CryptoJS.enc.Utf8)
    
      if(passwordDB != req.body.password){
        return res.status(404).json({error: '', text: 'Email ou senha incorretos'})
      }
      const funcId = funcionario[0].id;
      const token = jwt.sign({ funcId }, process.env.JWT_SECRET, {
        // expiresIn: 3000 //50 minutos
        expiresIn: 14400 //4 horas
      });
      
      return res.status(200).json({ auth: true, token: token });
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async wellcome(req,res){
    try{
      res.status(200).json({ message: 'bem-vindo!' });
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },
  
  async checkToken(req,res){
    try{
      const token = req.body.headers['x-access-token'];
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err){
          res.status(200).json({ auth: false, message: 'token expirado' });
        }else{
          res.status(200).json({ auth: true, message: 'token válido' });
        }
      })
    } catch(error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async logout(req,res){
    try{
      res.json({ auth: false, token: null });
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}