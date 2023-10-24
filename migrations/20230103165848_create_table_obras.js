/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('obras', function(table){
        table.increments('id').primary();
        table.integer('id_cliente').unsigned();
        table.foreign('id_cliente').references('id').inTable('clientes');
        table.string('numero_orcamento').notNullable();
        table.string('unidade').notNullable();
        table.string('status').notNullable();
        table.date('data_inicio').notNullable();
        table.date('data_fim');
        table.string('obra_desc');
      })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('obras')
};