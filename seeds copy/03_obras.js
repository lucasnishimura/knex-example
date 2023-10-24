/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('obras').del()
  await knex('obras').insert([
    { 
      id_cliente: 1,
      numero_orcamento: '4142314555425',
      unidade: "principal",
      status: "em andamento",
      data_inicio: "2021-08-13",
      data_fim: null,
      obra_desc: 'descrição da obra 1'
    }, 
    { 
      id_cliente: 2,
      numero_orcamento: '8475757589696',
      unidade: "Alphaville",
      status: "em andamento",
      data_inicio: "2021-08-13",
      data_fim: null,
      obra_desc: 'descrição da obra 2'
    }, 
    { 
      id_cliente: 2,
      numero_orcamento: '97979588929004',
      unidade: "principal",
      status: "em andamento",
      data_inicio: "2021-08-13",
      data_fim: null,
      obra_desc: 'descrição da obra 3'
    }, 
    { 
      id_cliente: 3,
      numero_orcamento: '18838486000333',
      unidade: "centro sp",
      status: "em andamento",
      data_inicio: "2021-08-13",
      data_fim: null,
      obra_desc: 'descrição da obra 4'
    }, 
    { 
      id_cliente: 3,
      numero_orcamento: '191938757758994',
      unidade: "Brasilia",
      status: "em andamento",
      data_inicio: "2021-08-13",
      data_fim: null,
      obra_desc: 'descrição da obra 5'
    }, 
  ]);
};
