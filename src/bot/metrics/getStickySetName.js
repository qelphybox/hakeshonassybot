const getStickySetName = (sticker) => (sticker && sticker.set_name ? sticker.set_name : '');

module.exports = getStickySetName;
