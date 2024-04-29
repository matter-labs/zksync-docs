import zkSyncConfig from '../../content/_zksync.json';

const tags: { [key: string]: string } = {};

export default defineNitroPlugin((nitroApp) => {
  parseConfig(zkSyncConfig, 'zk');

  nitroApp.hooks.hook('content:file:beforeParse', (file: { _id: string; body: string }) => {
    if (file._id.endsWith('.md')) {
      Object.keys(tags).forEach((key) => {
        file.body = file.body.replace(new RegExp(`%%${key}%%`, 'g'), tags[key]);
        // replace all "zeek" or "Zeek" with "<ZeekEasterEgg :text="replacedWord"></ZeekEasterEgg>"
        // make sure it case-insensitive and actually new word
      });
      file.body = file.body.replace(/zeek/gi, '<ZeekEasterEgg />');
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
