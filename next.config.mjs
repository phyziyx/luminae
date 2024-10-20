import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'files.stripes.com',
			'img.clerk.com'
		]
	},
	reactStrictMode: true
};

export default withNextIntl(nextConfig);
