/** @type {import('next').NextConfig} */
const nextConfig = {
 transpilePackages: ["@jfa/core","@jfa/contracts","@jfa/ui","@jfa/adapters","@jfa/security","@jfa/db"],
 async rewrites(){return [{source:"/articles/:slug",destination:"/articles?slug=:slug"}];}
};
export default nextConfig;
