module.exports = `
    select count(*), u.first_name, u.last_name
    from message_metrics
             join users_chats uc on uc.id = message_metrics.users_chats_id
             join chats c on c.id = uc.chat_id
             join users u on u.id = uc.user_id
    where c.tg_id = $1
      and timestamp between now() - INTERVAL '1 HOURS' and now()
    group by u.id
`;
