export default {
  BOT_NAME: process.env.BOT_NAME,
  DOMAIN: (() => {
    if (process.env.SUBDOMAIN) {
      return `https://${process.env.SUBDOMAIN}.loca.lt`;
    }

    const subdomain = process.env.BOT_NAME.replace(/[\W_]/i, '').toLowerCase();
    return `https://${subdomain}.loca.lt`;
  })(),
};
