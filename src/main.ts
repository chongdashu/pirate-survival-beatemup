import './styles.css';

import { createApp } from './shell/appShell';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Missing #app root');
}

createApp(root);
