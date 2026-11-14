import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import PublicSite from './PublicSite';
hydrateRoot(document.getElementById('root')!, <PublicSite/>);
