const getValues = (user) => [user.tg_id, user.first_name, user.last_name];

const createUser = async (client, user) => {
  const result = await client.query(
    `INSERT INTO users(tg_id, first_name, last_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (tg_id) DO UPDATE SET tg_id=EXCLUDED.tg_id
     RETURNING *`,
    getValues(user),
  );
  console.log(result);
  return result.rows[0];
};

module.exports = { createUser };
