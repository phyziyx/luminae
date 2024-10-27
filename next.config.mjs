import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'files.stripes.com',
			},
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
			}
		]
	},
	reactStrictMode: true
};

export default withNextIntl(nextConfig);
