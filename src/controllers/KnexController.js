const connection = require('../../database/connection');
// import { format } from 'date-fns'
const { format, parseISO } = require('date-fns');
const filter = require('knex-filter').filter;

module.exports = {
  async index(req, res){
    try {
      // const { page = 1 } = req.query;
      let filters = req.query;
      if(req.query?.nome){
        filters = {
          ...req.query,
          "funcionarios.nome like": req.query.nome
        }
        delete filters.nome
      }
  
      const [ count ] = await connection('ausencias').count();
      const ausencias  = await connection('ausencias')
      .join('funcionarios', 'funcionarios.id', '=', 'ausencias.id_func')
      .select([
          'ausencias.*',
          'funcionarios.nome',
          'funcionarios.cargo',
          'funcionarios.whatsapp'
      ])
      .where(filter(filters))
      .orderBy('ausencias.data_ausencia', 'desc')

      res.header('X-Total-Count', count['count(*)']);
  
      return res.json(ausencias);  
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try{
      const { 
        id_func,
        motivo,
        data_ausencia: dataAusencia,
      }  = req.body;
      // const ongId = req.headers.Authorization;
      
      const data_ausencia = format(parseISO(dataAusencia), 'yyyy-MM-dd');

      const {id} = await connection('ausencias').insert({
        id_func,
        motivo,
        data_ausencia,
      });
  
      return res.json({ id })
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },


  async alter(req, res){
    try {  
      const { 
        id,
        id_func,
        motivo,
        data_ausencia: dataAusencia,
      }  = req.body;

      const data_ausencia = format(parseISO(dataAusencia), 'yyyy-MM-dd');

      await connection('ausencias')
      .update({
        id_func,
        motivo,
        data_ausencia
      })
      .where('id', id);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { id } = req.body;
      
      await connection('ausencias').where('id', id).delete();
      return res.status(204).send();
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async knex(req, res){
    try {  
      console.log('oi')
      return res.status(200).send();
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}