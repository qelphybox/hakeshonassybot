module.exports = `
    select COUNT (DISTINCT stickersetname), u.first_name, u.last_name
    from message_metrics
             join users_chats uc on uc.id = message_metrics.users_chats_id
             join chats c on c.id = uc.chat_id
             join users u on u.id = uc.user_id
    where c.tg_id = $1
      and timestamp < to_timestamp($2)
    group by u.id
    order by COUNT (DISTINCT stickersetname) desc
    limit 1
`;
