/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('funcionarios').del()
  await knex('funcionarios').insert([
    {
      nome: "carlos",
      cpf: "123123123",
      cargo: "dono",
      whatsapp: "11912331238",
      statusFunc: "PJ",
      email: "carlos@infraengenharia.com",
      senha: "U2FsdGVkX1+b5nPvwlI2kZVKslrgKQL3Jsqv1HYTFBg=",
      city: "Barueri",
      uf: "SP",
      endereco: "rua das pedras, 88",
      data_contratacao: "2010-08-08",
      data_nascimento: "1964-01-09",
      salario: "12000",
      imagem: "caminho da imagem2"
    }
  ]);
};
