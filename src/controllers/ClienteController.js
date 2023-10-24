const connection = require('../../database/connection');
const filter = require('knex-filter').filter;
const { format, parseISO, getYear, add, sub, subYears } = require('date-fns');
// import add from 'date-fns/add'

module.exports = {
  async index(req, res){
    try {
      // const { page = 1 } = req.query;
  
      const [ count ] = await connection('clientes').count();
      const clientes  = await connection('clientes')
      .select([
          'clientes.*',
      ])
      .where(filter(req.query))
      .orderBy('clientes.nome', 'asc')
  
  
      res.header('X-Total-Count', count['count(*)']);

      const obras  = await connection('obras')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .select(['clientes.id as cliente_id','obras.unidade'])
      .where(filter(req.query))

      const newClients = []
      clientes.map(function(cliente){
        // console.log(cliente.data_contato)
        // if(cliente?.data_contato){
        //   cliente.data_contato = format(new Date(cliente.data_mapa.replace(/-/g, '\/').replace(/T.+/, '')), 'dd/MM/yyyy')
        // }
        const unidades = [];
        const filterUnidades = obras.map(function(obra){
          if(obra.cliente_id == cliente.id){
            unidades.push(obra.unidade);
          }
        })
        const returnClients = {
          ...cliente,
          unidades
        }
        newClients.push(returnClients)
      })

      return res.json(newClients);  
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try{
      const { 
          nome,
          cpf,
          cnpj,
          telefone,
          email,
          data_contato: dataContato,
          tipo_contrato
      }  = req.body;
      // const ongId = req.headers.Authorization;

      const data_contato = format(parseISO(dataContato), 'yyyy-MM-dd')
  
      const {id} = await connection('clientes').insert({
        nome,
        cpf,
        cnpj,
        telefone,
        email,
        data_contato,
        tipo_contrato,
        status: 'ativo'
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
          nome,
          cpf,
          cnpj,
          telefone,
          email,
          data_contato: dataContato,
          tipo_contrato,
      }  = req.body;
      
      const data_contato = format(parseISO(dataContato), 'yyyy-MM-dd')

      await connection('clientes')
      .update({
          nome,
          cpf,
          cnpj,
          telefone,
          email,
          data_contato,
          tipo_contrato,
          status: 'ativo'
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
      const { id } = req.body;
      if(id){
        await connection('clientes')
        .update({
          status: 'deletado'
        })
        .where('id', id);
  
        await connection('obras')
        .update({
          status: 'deletado'
        })
        .where('id_cliente', id);
    
        return res.status(200).send('Sucesso'); 
      }else{
        return res.status(400).send('Sem ID'); 
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async nextContact(req, res){
    //contato de clientes nos proximos 15 dias
    //contato de obras que foram feitas no ano passado
    //contato pos venda, finalizados no ultimo mes
    try {
      const nextTirtyDays = add(new Date(), {days: 15})      
      const lastYear = sub(new Date(), {months: 6})  
      
      const clientes  = await connection('clientes')
      .select([
          'clientes.*',
      ])
      .where("data_contato", ">=", format(new Date(), 'yyyy-MM-dd'))
      .andWhere("data_contato", "<=", format(nextTirtyDays, 'yyyy-MM-dd'))

      const obras = await connection('obras')
      .join('clientes', 'clientes.id', '=', 'obras.id_cliente')
      .select([
          'obras.*',
          'clientes.nome'
      ])
      .where("obras.data_fim", "<=", `${getYear(new Date())}-01-01`)
      .andWhere("obras.data_fim", ">=", `${getYear(lastYear)}-01-01`)
      .andWhere('obras.status', 'concluida')
      .orderBy('obras.data_fim')
      .limit(5)

      // const lastTirtyDays = sub(new Date(), {days: 30})    
      // const posVenda = await connection('obras')
      // .select([
      //     'obras.*',
      // ])
      // .where("data_fim", ">=", format(lastTirtyDays, 'yyyy-MM-dd'))
      // .andWhere('status', 'concluida')
      // .orderBy('data_fim')
      // .limit(5)
      // console.log(posVenda)
      const retorno = {
        clientes: [...clientes],
        obras: [...obras],
      }
      console.log(retorno)
      return res.json(retorno);
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}