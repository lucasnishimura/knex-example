const connection = require('../database/connection');

module.exports = {
  async index(req, res){
    try {  
      const { page = 1 } = req.query;
  
      const [ count ] = await connection('incidents').count();
  
      const incidents  = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
          'incidents.*',
          'ongs.name',
          'ongs.email',
          'ongs.whatsapp',
          'ongs.city',
          'ongs.uf',
        ]);
  
      res.header('X-Total-Count', count['count(*)']);
  
      return res.json(incidents);
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try {  
      const { title, description, value}  = req.body;
      const ongId = req.headers.Authorization;
  
      const {id} = await connection('incidents').insert({
        title,
        description,
        value,
        ongId
      });

      return res.json({ id })
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { id } = req.params;
      const ongId = req.headers.Authorization;
  
      const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();
  
      if(incident.ong_id != ongId){
        return res.status(401).json({error: 'Operação nao permitida'})
      }
  
      await connection('incidents').where('id', id).delete();
  
      return response.status(204).send();
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}