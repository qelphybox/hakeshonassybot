/* eslint-disable camelcase */
const getUserLink = ({ first_name, last_name, _id }) => `[${first_name}${last_name ? ` ${last_name}` : ''}](tg://user?id=${_id})`;
const getUserStatString = ({
  first_name, last_name, count, _id,
}) => `${getUserLink({ first_name, last_name, _id })} (${count})`;
/* eslint-enable camelcase */

const renderMessage = (statsStringsArray) => statsStringsArray.join('\n');


module.exports = { getUserLink, getUserStatString, renderMessage };
