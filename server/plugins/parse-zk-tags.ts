import zkSyncConfig from '../../content/_zksync.json';

const tags: { [key: string]: string } = {};

export default defineNitroPlugin((nitroApp) => {
  parseConfig(zkSyncConfig, 'zk');

  nitroApp.hooks.hook('content:file:beforeParse', (file: { _id: string; body: string }) => {
    if (file._id.endsWith('.md')) {
      Object.keys(tags).forEach((key) => {
        file.body = file.body.replace(new RegExp(`%%${key}%%`, 'g'), tags[key]);
      });
    }
  });

  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    if (file._id.endsWith('.md')) {
      const regex = /%%/gm;
      const body = JSON.stringify(file.body);
      if (process.env.NODE_ENV !== 'production' && regex.test(body)) {
        console.error(`Unparsed %% zk_tag found in ${file._file}`);
      }
    }
  });
});

function parseConfig(config: any, prefix: string) {
  Object.keys(config).forEach((key) => {
    const value = config[key];
    const newPrefix = `${prefix}_${key}`;
    if (typeof value === 'object' && value !== null) {
      parseConfig(value, newPrefix);
    } else {
      tags[newPrefix] = value;
    }
  });

  return tags;
}
