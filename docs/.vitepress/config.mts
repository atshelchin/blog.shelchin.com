import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "I'm Shelchin",
  description: "Home is where the heart is.",
  head: [
    // 引入全局 JavaScript 文件
    ["script", {
      src: "https://umami.appsdata.org/script.js",
      defer: "true",
      "data-website-id": "d7da45bc-5114-499e-ad5f-01d649cd332e",
    }],
  ],
  themeConfig: {
    search: {
      provider: "local",
    },
    editLink: {
      pattern:
        "https://github.com/atshelchin/blog.shelchin.com/edit/master/docs/:path",
      text: "Edit this page on GitHub",
    },
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "medium",
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      // { text: "Examples", link: "/en/markdown-examples" },
      { text: "English", link: "/en/how-to-deploy-safe-wallet-on-new-blockchain" },
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
            {
              text: "Solidity 语法掌握检查清单",
              link: "/zh/solidity-checklist",
            },
            {
              text: "如何创建一个写作任务",
              link: "/zh/writing-task",
            },
            {
              text: "用好 Git ，让软件历史更清晰易懂",
              link: "/zh/git-history",
            },
            {
              text: "设置一台新的 Postgres 服务器",
              link: "/zh/setup-postgres",
            },
            {
              text: "设置一台新的 Redis 服务器",
              link: "/zh/setup-redis",
            },
          ],
        },
        {
          text: "写作任务",
          items: [
            {
              "text": "关于 POE 一年订阅使用的感受",
              "link": "/zh/writing-task/2024-7-27",
            },
          ],
        },
      ],
      "/en": [
        {
          text: "English",
          items: [
            { text: "How to deploy Safe Wallet on a new blockchain", link: "/en/how-to-deploy-safe-wallet-on-new-blockchain" },
            // { text: "Runtime API Examples", link: "/en/api-examples" },
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
      { icon: "github", link: "https://github.com/atshelchin/blog.shelchin.com" },
    ],
  },
});
