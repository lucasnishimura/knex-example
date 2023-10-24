/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('funcionarios', function(table){
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('email');
        table.date('data_nascimento').notNullable();
      })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('funcionarios')
};