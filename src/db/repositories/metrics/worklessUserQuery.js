module.exports = `
    select count(*), u.first_name, u.last_name
    from message_metrics
             join users_chats uc on uc.id = message_metrics.users_chats_id
             join chats c on c.id = uc.chat_id
             join users u on u.id = uc.user_id
    where c.tg_id = $1
      and extract(dow from timestamp + interval '3 hour') in (1, 2, 3, 4, 5)
      and extract(hour from timestamp + interval '3 hour') > 10
      and extract(hour from timestamp + interval '3 hour') < 18
      and to_timestamp($2) > timestamp
      and to_timestamp($3) < timestamp
    group by u.id
    limit 1
`;
