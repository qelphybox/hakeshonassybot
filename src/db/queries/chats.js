const getValues = (chat) => [chat.tg_id, chat.name];

const createChat = async (client, chat) => {
  const result = await client.query(
    'INSERT INTO chats(tg_id, name) VALUES($1, $2) ON CONFLICT (tg_id) DO NOTHING RETURNING *',
    getValues(chat),
  );
  console.log(result);
  return result.rows[0];
};

module.exports = { createChat };
/*
const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
const values = ['brianc', 'brian.m.carlson@gmail.com']
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  }
})
// promise
client
  .query(text, values)
  .then(res => {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  })
  .catch(e => console.error(e.stack))
// async/await
try {
  const res = await client.query(text, values)
  console.log(res.rows[0])
  // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
} catch (err) {
  console.log(err.stack)
}
 */
