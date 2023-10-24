/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('ausencias', function(table){
        table.increments('id').primary();
        table.integer('id_func').unsigned();
        table.foreign('id_func').references('id').inTable('funcionarios');
        table.string('motivo');
        table.date('data_ausencia').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('ausencias')
};