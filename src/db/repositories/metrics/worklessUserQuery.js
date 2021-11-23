const ads = `
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
module.exports = ads;

// (
//     [
//       { $match: { 'chat.id': chat.id, date: { $gt: dayTimestamp } } },
//       {
//         $project: {
//           _id: 1,
//           'from.id': 1,
//           'from.username': 1,
//           'from.first_name': 1,
//           'from.last_name': 1,
//           dayOfWeekOfMessageTimestamp: {
//             $dayOfWeek: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' },
//           },
//           hourOfMessageTimestamp: { $hour: { date: { $toDate: { $multiply: ['$date', 1000] } }, timezone: '+03:00' } },
//         },
//       },
//       {
//         $match: {
//           $expr: {
//             $in: ['$dayOfWeekOfMessageTimestamp', [2, 3, 4, 5, 6]],
//           },
//         },
//       },
//       { $match: { $expr: { $and: [{ $gte: ['$hourOfMessageTimestamp', 10] }, { $lt: ['$hourOfMessageTimestamp', 18] }] } } },
//       {
//         $group: {
//           _id: '$from.id',
//           count: { $sum: 1 },
//           username: { $first: '$from.username' },
//           first_name: { $first: '$from.first_name' },
//           last_name: { $first: '$from.last_name' },
//         },
//       },
//       { $sort: { count: -1 } },
//       { $limit: 1 },
//     ],
//   )
