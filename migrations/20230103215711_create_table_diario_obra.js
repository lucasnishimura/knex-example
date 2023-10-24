/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('diario_obra', function(table){
        table.increments('id').primary();
        table.integer('id_obra');
        table.string('nota_diario');
        table.date('data_nota').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('diario_obra')
};
