/**
 * @type {import('vite').UserConfig}
 *  
 */

export default {
    base : process.env.NODE_ENV === 'production' ? '/my-app/' : '/',
    // other Vite configuration options can go here
};
