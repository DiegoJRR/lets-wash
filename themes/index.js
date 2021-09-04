import { theme as defaultTheme } from './default';
import { theme as blackTheme } from './black';
import { theme as whiteTheme } from './white';
import { theme as defaultDark } from './default-dark';
import { theme as defaultLight } from './default-light';

export const themes = {
    default: {
        primary: '#26B9F9',
        theme: defaultTheme,
    },
    white: {
        primary: '#E4E8EE', // deprecated: #ECECEC
        theme: whiteTheme,
    },
    light: {
        primary: '#B3DDF2',
        theme: defaultLight,
    },
    dark: {
        primary: '#101D4B',
        theme: defaultDark,
    },
    // green: {
    //     primary: '#02AC66',
    //     theme: greenTheme,
    // },
    black: {
        primary: '#161515', // deprecated: #222222
        theme: blackTheme,
    },
};
