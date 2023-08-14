// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = {
  mainSidebar: [
    {
      type: "html",
      value:
        '<a class="navbar__brand" href="/"><div class="navbar__logo"><img src="/img/walletconnect-logo-white.svg#dark-mode-only"  alt="WalletConnect Logo"><img src="/img/walletconnect-logo-black.svg#light-mode-only"  alt="WalletConnect Logo"></div>WalletConnect<span>Specs<span></a>',
      defaultStyle: true,
    },
    {
      type: "category",
      label: "Specs",
      className: "menu_outer_list",
      items: [
        "readme",
        {
          type: "category",
          label: "Client APIs",
          collapsed: false,
          items: [
            {
              type: "category",
              label: "Sign API",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/clients/sign",
                },
              ],
            },
            {
              type: "category",
              label: "Auth API",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/clients/auth",
                },
              ],
            },
            {
              type: "category",
              label: "Chat API",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/clients/chat",
                },
              ],
            },
            {
              type: "category",
              label: "Notify API",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/clients/notify",
                },
              ],
            },
            {
              type: "category",
              label: "Core API",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/clients/core",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Server APIs",
          collapsed: false,
          items: [
            {
              type: "category",
              label: "Relay Server",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/servers/relay",
                },
              ],
            },
            {
              type: "category",
              label: "Keys Server",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/servers/keys",
                },
              ],
            },
            {
              type: "category",
              label: "Push Server",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/servers/push",
                },
              ],
            },
            {
              type: "category",
              label: "Notify Server",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/servers/notify",
                },
              ],
            },
            {
              type: "category",
              label: "Archive Server",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/servers/archive",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Meta-Clients API",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "Web3Inbox",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/meta-clients/web3inbox",
                },
              ],
            },
            {
              type: "category",
              label: "Web3Wallet",
              items: [
                {
                  type: "autogenerated",
                  dirName: "specs/meta-clients/web3wallet",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Blockchain RPC",
      className: "menu_outer_list",
      items: [
        {
          type: "autogenerated",
          dirName: "blockchain-rpc",
        },
      ],
    },
    {
      type: "category",
      label: "Glossary",
      className: "menu_outer_list",
      items: [
        {
          type: "autogenerated",
          dirName: "glossary",
        },
      ],
    },
  ],
};
