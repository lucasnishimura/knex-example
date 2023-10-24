/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('diario_obra').del()
  await knex('diario_obra').insert([
    { 
      id_obra: 1,
      nota_diario: "Obra com desvio de vazamento",
      data_nota: "2022-01-03"
    }, 
    { 
      id_obra: 1,
      nota_diario: "Vazamento ajustado",
      data_nota: "2023-01-04"
    }, 
    { 
      id_obra: 1,
      nota_diario: "Aguardando visita enel",
      data_nota: "2023-01-05"
    }, 
    { 
      id_obra: 1,
      nota_diario: "Enel dá a aprovação",
      data_nota: "2023-02-03"
    }, 
    { 
      id_obra: 1,
      nota_diario: "Obra nos acabamentos",
      data_nota: "2023-02-05"
    }, 
    { 
      id_obra: 2,
      nota_diario: "Falta de material, precisa retornar no dia seguinte",
      data_nota: "2023-01-03"
    }, 
    { 
      id_obra: 2,
      nota_diario: "Material reposto",
      data_nota: "2023-01-04"
    }, 
    { 
      id_obra: 2,
      nota_diario: "Projeto finalizado",
      data_nota: "2023-01-05"
    }, 
  ]);
};
