
exports.up = function(knex, Promise) {
    return knex.schema.createTable('processed_tx', function (t) {
        t.integer('index').notNullable()
        t.string('txHash').notNullable()
        t.string('txRoot').notNullable()
        t.string('stateRoot').notNullable()
        t.string('fromX').notNullable()
        t.string('fromY').notNullable()
        t.string('toX').notNullable()
        t.string('toY').notNullable()
        t.integer('amount').notNullable()
        t.integer('tokenType').notNullable()
      })  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('processed_tx')
};