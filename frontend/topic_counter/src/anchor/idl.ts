export type TopicCounter = {
  address: "8fwUnvsRypGyT17uHcp3gE6mCVT46FXqDhR1DDy4ZNee";
  metadata: {
    name: "topic_counter";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "create_topic";
      discriminator: [17, 149, 231, 194, 81, 173, 176, 41];
      accounts: [
        {
          name: "topic_owner";
          writable: true;
          signer: true;
        },
        {
          name: "topic_account";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 111, 112, 105, 99];
              },
              {
                kind: "arg";
                path: "title";
              },
              {
                kind: "account";
                path: "topic_owner";
              }
            ];
          };
        },
        {
          name: "topic_storage";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  112,
                  105,
                  99,
                  95,
                  115,
                  116,
                  111,
                  114,
                  97,
                  103,
                  101
                ];
              }
            ];
          };
        },
        {
          name: "system_program";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "content";
          type: "string";
        }
      ];
    },
    {
      name: "deploy_program";
      discriminator: [120, 79, 182, 165, 160, 10, 146, 229];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "topic_storage";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  112,
                  105,
                  99,
                  95,
                  115,
                  116,
                  111,
                  114,
                  97,
                  103,
                  101
                ];
              }
            ];
          };
        },
        {
          name: "system_program";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "Topic";
      discriminator: [181, 15, 35, 125, 85, 137, 67, 106];
    },
    {
      name: "TopicStorage";
      discriminator: [134, 85, 236, 218, 252, 167, 90, 199];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "TitleTooLong";
      msg: "The title exceeds the maximum length of 32 bytes.";
    },
    {
      code: 6001;
      name: "ContentTooLong";
      msg: "The content exceeds the maximum length of 200 bytes.";
    }
  ];
  types: [
    {
      name: "Topic";
      type: {
        kind: "struct";
        fields: [
          {
            name: "topic_author";
            type: "pubkey";
          },
          {
            name: "title";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "content";
            type: {
              array: ["u8", 200];
            };
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "TopicStorage";
      type: {
        kind: "struct";
        fields: [
          {
            name: "total_topics";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};

export const IDL: TopicCounter = {
  address: "8fwUnvsRypGyT17uHcp3gE6mCVT46FXqDhR1DDy4ZNee",
  metadata: {
    name: "topic_counter",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "create_topic",
      discriminator: [17, 149, 231, 194, 81, 173, 176, 41],
      accounts: [
        {
          name: "topic_owner",
          writable: true,
          signer: true,
        },
        {
          name: "topic_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [116, 111, 112, 105, 99],
              },
              {
                kind: "arg",
                path: "title",
              },
              {
                kind: "account",
                path: "topic_owner",
              },
            ],
          },
        },
        {
          name: "topic_storage",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  116, 111, 112, 105, 99, 95, 115, 116, 111, 114, 97, 103, 101,
                ],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "title",
          type: "string",
        },
        {
          name: "content",
          type: "string",
        },
      ],
    },
    {
      name: "deploy_program",
      discriminator: [120, 79, 182, 165, 160, 10, 146, 229],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
        },
        {
          name: "topic_storage",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  116, 111, 112, 105, 99, 95, 115, 116, 111, 114, 97, 103, 101,
                ],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Topic",
      discriminator: [181, 15, 35, 125, 85, 137, 67, 106],
    },
    {
      name: "TopicStorage",
      discriminator: [134, 85, 236, 218, 252, 167, 90, 199],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "TitleTooLong",
      msg: "The title exceeds the maximum length of 32 bytes.",
    },
    {
      code: 6001,
      name: "ContentTooLong",
      msg: "The content exceeds the maximum length of 200 bytes.",
    },
  ],
  types: [
    {
      name: "Topic",
      type: {
        kind: "struct",
        fields: [
          {
            name: "topic_author",
            type: "pubkey",
          },
          {
            name: "title",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "content",
            type: {
              array: ["u8", 200],
            },
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "TopicStorage",
      type: {
        kind: "struct",
        fields: [
          {
            name: "total_topics",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
};
