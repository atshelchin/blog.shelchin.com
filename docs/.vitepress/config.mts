import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "I'm Shelchin",
  description: "Home is where the heart is.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/en/markdown-examples" },
      { text: "汉字", link: "/zh/seo-guide" },
    ],

    sidebar: {
      "/zh/": [
        {
          text: "汉字区",
          items: [
            {
              text: "SEO 优化怎么做",
              link: "/zh/seo-guide",
            },
          ],
        },
      ],
      "/en": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/en/markdown-examples" },
            { text: "Runtime API Examples", link: "/en/api-examples" },
          ],
        },
      ],
    },

    // sidebar: [

    //   {
    //     text: '华语区',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
