import knex from 'knex';

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

// to check how many request are being done to the database
connection.on('query', ({ sql, bindings }) => {
  const query = connection.raw(sql, bindings).toQuery();
  console.log('[db]', query);
});