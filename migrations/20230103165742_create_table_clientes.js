/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('clientes', function(table){
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cpf');
        table.string('cnpj');
        table.string('telefone');
        table.string('email');
        table.date('data_contato');
        table.string('tipo_contrato').notNullable();
        table.string('status').notNullable();
      })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('clientes')
};