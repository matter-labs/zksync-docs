// TODO: `active` prop is not working properly, need to fix it
export const headerLinks = () => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const activeApp = config.public.app;
  const isDocsApp = activeApp === 'docs';
  const isCodeApp = activeApp === 'code';

  return [
    {
      label: 'ZKsync Era',
      to: isDocsApp ? '/zksync-era' : `${config.public.urls.docs}/zksync-era`,
      active: route.path.startsWith('/zksync-era'),
    },
    {
      label: 'ZK Stack',
      to: isDocsApp ? '/zk-stack' : `${config.public.urls.docs}/zk-stack`,
      active: route.path.startsWith('/zk-stack'),
    },
    {
      label: 'ZKsync Protocol',
      to: isDocsApp ? '/zksync-protocol' : `${config.public.urls.docs}/zksync-protocol`,
      active: route.path.startsWith('/zksync-protocol'),
    },
    {
      label: 'Ecosystem',
      to: isDocsApp ? '/ecosystem' : `${config.public.urls.docs}/ecosystem`,
      active: route.path.startsWith('/ecosystem'),
    },
    {
      label: 'Community Code',
      to: isCodeApp ? '/' : `${config.public.urls.code}`,
      active: isCodeApp,
    },
  ];
};
