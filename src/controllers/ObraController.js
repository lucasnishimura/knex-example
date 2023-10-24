const connection = require('../../database/connection');
// import { format } from 'date-fns'
const { format, parseISO } = require('date-fns');
const filter = require('knex-filter').filter;

module.exports = {
  async index(req, res){
    try {  
      // const { page = 1 } = req.query;
      
      let filters = req.query
      if(req.params?.id){
        filters = {
          ...req.query,
          "obras.id": req.params?.id
        }
      }
      
      const [ count ] = await connection('obras').count();
      const obras  = await connection('obras')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .select([
          'obras.*','clientes.nome as cliente'
      ])
      .where(filter(filters))
      .orderBy('clientes.nome', 'asc')
  
      res.header('X-Total-Count', count['count(*)']);
  
      return res.json(obras);
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try {  
      const { 
          unidade,
          id_cliente,
          status,
          data_inicio: dataInicio,
          data_fim: dataFim,
          obra_desc,
          numero_orcamento
      }  = req.body;
      // const ongId = req.headers.Authorization;
  
      const data_fim = (dataFim == '' || dataFim == null) ? null : format(parseISO(dataFim), 'yyyy-MM-dd');
      const data_inicio = format(parseISO(dataInicio), 'yyyy-MM-dd')
  
      const {id} = await connection('obras').insert({
        unidade,
        id_cliente,
        status,
        data_inicio,
        data_fim,
        obra_desc,
        numero_orcamento
      });
  
      return res.json({ id });
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },


  async alter(req, res){
    try {  
      const { 
        id,
        unidade,
        id_cliente,
        status,
        data_inicio: dataInicio,
        data_fim: dataFim,
        obra_desc,
        numero_orcamento
      }  = req.body;
  
      const data_fim = (dataFim == '' || dataFim == null) ? null : format(parseISO(dataFim), 'yyyy-MM-dd');
      const data_inicio = format(parseISO(dataInicio), 'yyyy-MM-dd')
  
      if(status == 'finalizado' && dataFim == ''){
          return res.status(400).json({error: 'Insira uma data final para finalizar a obra'})
      }
  
      await connection('obras')
      .update({
        unidade,
        id_cliente,
        status,
        data_inicio,
        data_fim,
        obra_desc,
        numero_orcamento
      })
      .where('id', id);
  
      return res.status(200).send(); 
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { idObra } = req.body;
      if(!idObra){
        return res.status(400).send('Sem ID'); 
      }
      await connection('obras')
      .update({
        status: 'deletado'
      })
      .where('id', idObra);
      
      return res.status(200).send(); 
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}