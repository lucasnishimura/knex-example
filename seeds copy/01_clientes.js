/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('clientes').del()
  await knex('clientes').insert([
    { 
      nome: "tecban", 
      cpf: "",
      cnpj: "123312312313/0001.11",
      telefone: "(11)111111111",
      email: "tecban@gmail.com",
      tipo_contrato: "projeto",
      status: "em andamento"
    }, 
    { 
      nome: "tecnisa", 
      cpf: "",
      cnpj: "222222222222/0001.22",
      telefone: "(22)2222222222",
      email: "tecnisa@gmail.com",
      tipo_contrato: "projeto",
      status: "em andamento"
    },
    { 
      nome: "banco do brasil", 
      cpf: "",
      cnpj: "3333333333333/0001.33",
      telefone: "(22)2222222222",
      email: "contato@bb.com",
      tipo_contrato: "projeto",
      status: "em andamento"
    }
  ]);
};
