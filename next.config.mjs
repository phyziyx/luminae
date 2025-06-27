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
				hostname: 'files.edgestore.dev',
				pathname: '/xjzwgej6oom8emji/**'
			}
		]
	},
	reactStrictMode: true,
	output: 'standalone'
};

export default withNextIntl(nextConfig);
