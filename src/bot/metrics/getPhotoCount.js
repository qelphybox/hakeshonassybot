const getPhotoCount = (photo, text) => ((photo || /.*.jpg|.*.png/.test(text)) ? 1 : 0);

module.exports = getPhotoCount;
