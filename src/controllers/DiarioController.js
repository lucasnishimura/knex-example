const connection = require('../../database/connection');
// import { format } from 'date-fns'
const { format, parseISO } = require('date-fns');
const filter = require('knex-filter').filter;

module.exports = {
  async index(req, res){
    try {
      // const { page = 1 } = req.query;
      const [ count ] = await connection('diario_obra').count();
      const diario_obra  = await connection('diario_obra')
      .join('obras', 'obras.id', '=', 'diario_obra.id_obra')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .select([
          'diario_obra.*',
          'clientes.nome',
          'obras.unidade',
      ])
      .where(filter(req.query))
  
  
      res.header('X-Total-Count', count['count(*)']);
  
      return res.json(diario_obra);  
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try{
      const { 
        id_obra,
        nota_diario,
        data_nota: dataNota,
      }  = req.body;
      // const ongId = req.headers.Authorization;
      
      const data_nota = format(parseISO(dataNota), 'yyyy-MM-dd')

      const id = await connection('diario_obra').insert({
        id_obra,
        nota_diario,
        data_nota,
      });
  
      return res.json({ id })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },


  async alter(req, res){
    try {  
      const { 
        id,
        id_obra,
        nota_diario,
        data_nota: dataNota,
      }  = req.body;

      const data_nota = format(parseISO(dataNota), 'yyyy-MM-dd')

      await connection('diario_obra')
      .update({
        id_obra,
        nota_diario,
        data_nota,
      })
      .where('id', id);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { id } = req.params;
      await connection('diario_obra').where('id', id).delete();
  
      return res.status(204).send();
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },
}