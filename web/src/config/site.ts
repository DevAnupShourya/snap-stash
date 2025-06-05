export type SiteConfig = typeof siteConfig;

// TODO add it in html
export const siteConfig = {
  name: "SnapStash",
  description: "A fast, private, minimal web app to stash personal content (videos, notes, links, files) across devices with instant, passwordless login.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Register",
      href: "/register",
    },
    {
      label: "Login",
      href: "/login",
    },
  ],
  links: {
    github: "https://github.com/DevAnupShourya/snap-stash",
    twitter: "https://twitter.com/Shourya_Anup",
    docs: "https://github.com/DevAnupShourya/snap-stash?tab=readme-ov-file#snapstash",
    discord: "https://discord.com/users/1205834045486006323",
  },
};
