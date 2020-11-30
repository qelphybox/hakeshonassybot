/* eslint-disable camelcase */
const getUserLink = ({ first_name, last_name, _id }) => `[${first_name}${last_name ? ` ${last_name}` : ''}](tg://user?id=${_id})`;
const getFullUserName = ({ first_name, last_name }) => `${first_name}${last_name ? ` ${last_name}` : ''}`;
const getUserStatString = ({
  first_name, last_name, count,
}) => `${getFullUserName({ first_name, last_name })} (${count})`;
/* eslint-enable camelcase */

module.exports = {
  getUserLink, getUserStatString, getFullUserName,
};
