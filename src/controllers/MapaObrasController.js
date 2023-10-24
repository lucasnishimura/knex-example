const connection = require('../../database/connection');
const filter = require('knex-filter').filter;
const { format, parseISO } = require('date-fns');

module.exports = {
  async index(req, res){
    try {  
      let filters = req.query;
      if(req.query?.funcionario){
        filters = {
          ...req.query,
          "funcionarios.nome like": req.query.funcionario
        }
        delete filters.funcionario
      }
      
      if(req.query?.cliente){
        filters = {
          ...req.query,
          "clientes.nome like": req.query.cliente
        }
        delete filters.cliente
      }
  
      const [ count ] = await connection('mapa_obras').count();
      const mapa_obras  = await connection('mapa_obras')
      .join('obras', 'obras.id', '=', 'mapa_obras.id_obra')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .join('funcionarios', 'funcionarios.id', '=', 'mapa_obras.id_func')
      .select('mapa_obras.id', 'funcionarios.nome as funcionario', 'clientes.nome as cliente','obras.unidade as unidade','mapa_obras.data_mapa')
      .orderBy([{column:"mapa_obras.id",order:"desc"}])
      .where(filter(filters))
      
      res.header('X-Total-Count', count['count(*)']);

      console.log(mapa_obras)
      const retornoDataGrid = {}
      retornoDataGrid.columns = [
        {field: 'id', hide: true},
        {field: 'funcionario', headerName: 'Funcionário', width: 110}, 
        {field: 'cliente', headerName: 'Cliente', width: 180, editable: false}, 
        {field: 'unidade', headerName: 'Unidade', width: 120, editable: false},
        {field: 'data_mapa', headerName: 'Data', width: 150}
      ]
      retornoDataGrid.rows = mapa_obras;
  console.log(retornoDataGrid)
      return res.json(mapa_obras);
      // return res.json(retornoDataGrid);
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try {  
      const { 
         id_func,
         id_obra,
         data_mapa
      }  = req.body;

      if(id_obra == "faltou"){
        const dataMapa = format(parseISO(data_mapa), 'yyyy-MM-dd');

        const {id} = await connection('ausencias').insert({
          id_func,
          motivo: "faltou",
          data_ausencia: dataMapa,
        });

        return res.json({ id })
      }
  
      const mapa  = await connection('obras')
      .select([
          'data_inicio',
      ])
      .where('id', id_obra)
      const data_obra_db = mapa[0].data_inicio;
      
      if(parseISO(data_mapa) < data_obra_db){
        return res.status(400).json({error: 'Insira uma data superior a data de inicio do projeto'})
      }
  
      const {id} = await connection('mapa_obras').insert({
          id_func,
          id_obra,
          data_mapa
      });
  
      return res.json({ id })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { id } = req.params;
      // const ongId = req.headers.Authorization;
      await connection('mapa_obras').where('id', id).delete();
  
      return res.status(204).send();
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async alter(req, res){
    try {  
      const { 
        id,
        id_func,
        id_obra,
        data_mapa
      }  = req.body;
  
      await connection('mapa_obras')
      .update({
        id_func,
        id_obra,
        data_mapa
      })
      .where('id', id);
  
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async today(req, res){
    try {  
      let filters = req.query;
  
      const [ count ] = await connection('mapa_obras').count();
      const mapa_obras  = await connection('mapa_obras')
      .join('obras', 'obras.id', '=', 'mapa_obras.id_obra')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .join('funcionarios', 'funcionarios.id', '=', 'mapa_obras.id_func')
      .select('funcionarios.nome as funcionario', 'obras.id as id_obra')
      .orderBy([{column:"mapa_obras.id",order:"desc"}])
      .where(filter(filters))
      
      res.header('X-Total-Count', count['count(*)']);

      const obras  = await connection('obras')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .select(['obras.id','obras.unidade', 'clientes.nome'])

      const listAll = [];
      obras.map(function(obra){
        const groupObra = {}
        const unidade = `${obra.nome} | ${obra.unidade}`
        const func = [];
        mapa_obras.map(function(element){
          if(element.id_obra == obra.id){
            func.push(element.funcionario)
          }
        })

        if(func.length != 0){
          groupObra.unidade = unidade
          groupObra.funcionarios = func
          listAll.push(groupObra)
        }
      })
      
      return res.json(listAll);
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}