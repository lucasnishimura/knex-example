/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('mapa_obras', function(table){
        table.increments('id').primary();
        table.string('id_func');
        table.string('id_obra');
        table.date('data_mapa').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('mapa_obras')
};