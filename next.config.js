/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/autenticar',
          permanent: true, // Usa `false` si la redirección es temporal
        },
      ];
    },
  };

module.exports = nextConfig
