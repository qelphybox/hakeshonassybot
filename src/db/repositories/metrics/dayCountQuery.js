module.exports = `
    select count(*), users_chats_id
    from message_metrics
        join users_chats uc on uc.id = message_metrics.users_chats_id
        join chats c on c.id = uc.chat_id
    where c.tg_id = $1 and timestamp between now() - INTERVAL '24 HOURS' and now()
    group by users_chats_id
`;
