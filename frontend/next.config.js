/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json'],
    },
    ...withPWA({
        dest: 'public',
        register: true,
        skipWaiting: true,
    })
};

module.exports = nextConfig;
