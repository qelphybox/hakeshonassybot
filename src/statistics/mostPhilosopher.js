const { dbClient } = require('../dbClient');
const { getFullUserName } = require('../utils/render');

const collect = async ({ chat }) => {
  const data = await dbClient.queryMessages((messages) => messages.aggregate(
    [
    { $match: { 'chat.id': chat.id, text: { $exists: true } } },
      {
        $project: {
          _id: 1,
          'from.id': 1,
          'from.username': 1,
          'from.first_name': 1,
          'from.last_name': 1,
          'text_length': { $strLenCP: '$text' },
        },
      },
      { $sort: { text_length: 1 } },
      {
        $group: {
          _id: '$from.id',
          count: { $sum: 1 },
          username: { $first: '$from.username' },
          first_name: { $first: '$from.first_name' },
          last_name: { $first: '$from.last_name' },
          all_msg_len_array: { $push: '$text_length'}, 
        },
      },
      { $addFields: {
        middle_index: { $floor: {$divide: ['$count', 2]}}}},
      { $addFields: {
        middle_index_less: { $subtract: ['$middle_index', 1]}}},
      { 
        $addFields: {
          median: { 
            $cond: {
              if: { $mod: ['$count', 2]},
              then: { $arrayElemAt: ['$all_msg_len_array', '$middle_index']},
              else: { $divide: 
                [ 
                { $sum: [
                  { $arrayElemAt: ['$all_msg_len_array', '$middle_index']},
                  { $arrayElemAt: ['$all_msg_len_array', '$middle_index_less']}
                  ]}, 2
                ]
              }
            }
          }
        }
      },
      { $sort: { median: 1 } },
      { $limit: 1 },
    ],
  )
    .toArray());
  return data;
};

const render = (collectedStat) => {
  if (collectedStat.length > 0) {
    return `${getFullUserName(collectedStat[0])} - философ чата`;
  }
  return '';
};

module.exports = {
  render,
  collect,
};


// "_id" : ObjectId("5f0d80f1147b320011bc9d12"), 
// "message_id" : 5, 
// "from" : { 
//   "id" : 256986252, 
//   "is_bot" : false, 
//   "first_name" : "Dmitry", 
//   "last_name" : "Barabash", 
//   "username" : "mowshen", 
//   "language_code" : "en" 
// }, 
// "chat" : { 
//   "id" : 256986252, 
//   "first_name" : "Dmitry", 
//   "last_name" : "Barabash", 
//   "username" : "mowshen", 
//   "type" : "private" 
// }, 
// "date" : 1594720496, 
// "text" : "Fghj" 


// db.messages.aggregate(
//     [
//     { $match: { 'chat.id': 256986252, text: { $exists: true } } },
//       {
//         $project: {
//           _id: 1,
//           'from.id': 1,
//           'from.username': 1,
//           'from.first_name': 1,
//           'from.last_name': 1,
//           'text_length': { $strLenCP: '$text' },
//         },
//       },
//       { $sort: { text_length: 1 } },
//       {
//         $group: {
//           _id: '$from.id',
//           count: { $sum: 1 },
//           username: { $first: '$from.username' },
//           first_name: { $first: '$from.first_name' },
//           last_name: { $first: '$from.last_name' },
//           all_msg_len_array: { $push: '$text_length'}, 
//         },
//       },
//       { $addFields: {
//         middle_index: { $floor: {$divide: ['$count', 2]}}}},
//       { $addFields: {
//         middle_index_less: { $subtract: ['$middle_index', 1]}}},
//       { 
//         $addFields: {
//           median: { 
//             $cond: {
//               if: { $mod: ['$count', 2]},
//               then: { $arrayElemAt: ['$all_msg_len_array', '$middle_index']},
//               else: { $divide: 
//                 [ 
//                 { $sum: [
//                   { $arrayElemAt: ['$all_msg_len_array', '$middle_index']},
//                   { $arrayElemAt: ['$all_msg_len_array', '$middle_index_less']}
//                   ]}, 2
//                 ]
//               }
//             }
//           }
//         }
//       },
//       { $sort: { median: 1 } },
//       { $limit: 100 },
//     ],
//   )

