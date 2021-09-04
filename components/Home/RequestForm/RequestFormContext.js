import { createContext } from 'react';

export const requestFormContext = createContext({
    step: 0,
    allowStep: false,
    footerOptions: {
        display: true,
        disabled: false,
        left: {
            display: true,
            text: 'Cancelar',
        },
        right: {
            display: true,
            text: 'Continuar',
        },
    },
    setFooterOptions: (options) => {},
    setAllowStep: (allow) => {},
    setFooterLabels: (left, right) => {},
    prev: () => {},
    next: () => {},
});

export const defaultFooterOptions = {
    display: true,
    disabled: false,
    left: {
        display: true,
        text: 'Cancelar',
    },
    right: {
        display: true,
        text: 'Continuar',
    },
};
