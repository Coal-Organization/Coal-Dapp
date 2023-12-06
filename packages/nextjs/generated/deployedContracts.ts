const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        Loopist: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "loopist",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "previousAdminRole",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "newAdminRole",
                  type: "bytes32",
                },
              ],
              name: "RoleAdminChanged",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleGranted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleRevoked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "date",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "author",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "metadata",
                  type: "string",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "songId",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "shares",
                      type: "uint256",
                    },
                  ],
                  indexed: false,
                  internalType: "struct Loopist.Copyright[]",
                  name: "copyrights",
                  type: "tuple[]",
                },
                {
                  components: [
                    {
                      internalType: "address",
                      name: "addr",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "typeOf",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "date",
                      type: "uint256",
                    },
                  ],
                  indexed: false,
                  internalType: "struct Loopist.Permission[]",
                  name: "permissions",
                  type: "tuple[]",
                },
              ],
              name: "SongAdded",
              type: "event",
            },
            {
              inputs: [],
              name: "DEFAULT_ADMIN_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "LOOPIST_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "author",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "metadata",
                  type: "string",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "songId",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "shares",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct Loopist.Copyright[]",
                  name: "copyrights",
                  type: "tuple[]",
                },
              ],
              name: "addSong",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "songId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "addr",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "typeOf",
                  type: "uint256",
                },
              ],
              name: "buyPermission",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "currentSongId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "songId",
                  type: "uint256",
                },
              ],
              name: "getCopyrights",
              outputs: [
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "songId",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "shares",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct Loopist.Copyright[]",
                  name: "",
                  type: "tuple[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getCurrentSongId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "songId",
                  type: "uint256",
                },
              ],
              name: "getPermissions",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "addr",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "typeOf",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "date",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct Loopist.Permission[]",
                  name: "",
                  type: "tuple[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
              ],
              name: "getRoleAdmin",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "songId",
                  type: "uint256",
                },
              ],
              name: "getSong",
              outputs: [
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "date",
                      type: "uint256",
                    },
                    {
                      internalType: "address",
                      name: "author",
                      type: "address",
                    },
                    {
                      internalType: "string",
                      name: "metadata",
                      type: "string",
                    },
                    {
                      components: [
                        {
                          internalType: "uint256",
                          name: "songId",
                          type: "uint256",
                        },
                        {
                          internalType: "uint256",
                          name: "shares",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Loopist.Copyright[]",
                      name: "copyrights",
                      type: "tuple[]",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "addr",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "typeOf",
                          type: "uint256",
                        },
                        {
                          internalType: "uint256",
                          name: "date",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Loopist.Permission[]",
                      name: "permissions",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Loopist.Song",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "grantRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "hasRole",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "renounceRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "revokeRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "songs",
              outputs: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "date",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "author",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "metadata",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
