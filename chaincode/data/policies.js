module.exports = {
  policies: {
    "cc0c5381-3c43-4c64-86d9-770655ebb696": {
      name: "Consumer allowed to access provider data",
      inputs: [
        {
          description: "Consortium UUID of data provider",
          name: "provider_consortium_uuid",
          source: "internal",
        },
        {
          description: "Consortium UUID of data consumer",
          name: "consumer_consortium_uuid",
          source: "internal",
        },
      ],
      outputs: [{ description: "Access allowed", name: "access_allowed" }],
      url: {
        human: "/policies/gdpr-attribution/README.txt",
        legal: "/policies/gdpr-attribution/POLICY.txt",
        machine: "/policies/gdpr-attribution/gdpr-attribution.eflint",
      },
      hash_type: "SHA-256",
      hash: {
        human:
          "e5e61f918d66cd421ee506dff43f713b3e74449a23d035b65b8115196d7397d9",
        legal:
          "d0119b1ff66c27f3973c0437bc2a19d426f6a5532313abca9cd9b7fdd37ba614",
        machine:
          "8C2B4CA076E57619E239958200FF18D4CFC0E931755C2648D66B36F2BD4D7E0B",
      },
    },

    "8cceff93-ac99-4d10-a121-35413e3bea5a": {
      name: "Data confirms to consortium rules",
      inputs: [
        {
          description: "Dataview UUID",
          name: "dataview_uuid",
          source: "internal",
        },
      ],
      outputs: [{ description: "Data OK", name: "data_ok" }],
      url: {
        human: "/policies/gdpr-attribution/README.txt",
        legal: "/policies/gdpr-attribution/POLICY.txt",
        machine: "/policies/gdpr-attribution/gdpr-attribution.eflint",
      },
      hash_type: "SHA-256",
      hash: {
        human:
          "e5e61f918d66cd421ee506dff43f713b3e74449a23d035b65b8115196d7397d9",
        legal:
          "d0119b1ff66c27f3973c0437bc2a19d426f6a5532313abca9cd9b7fdd37ba614",
        machine:
          "8C2B4CA076E57619E239958200FF18D4CFC0E931755C2648D66B36F2BD4D7E0B",
      },
    },

    "21693473-d070-43bf-aca7-b75adbb51e48": {
      name: "Consortium partner allowed to access data",
      inputs: [
        {
          description: "Consortium UUID of data provider",
          name: "provider_consortium_uuid",
          source: "internal",
        },
        {
          description: "Consortium UUID of data consumer",
          name: "consumer_consortium_uuid",
          source: "internal",
        },
        {
          description: "Dataview UUID",
          name: "dataview_uuid",
          source: "internal",
        },
      ],
      outputs: [{ description: "Access allowed", name: "access_allowed" }],
      url: {
        human: "/policies/gdpr-attribution/README.txt",
        legal: "/policies/gdpr-attribution/POLICY.txt",
        machine: "/policies/gdpr-attribution/gdpr-attribution.eflint",
      },
      hash_type: "SHA-256",
      hash: {
        human:
          "e5e61f918d66cd421ee506dff43f713b3e74449a23d035b65b8115196d7397d9",
        legal:
          "d0119b1ff66c27f3973c0437bc2a19d426f6a5532313abca9cd9b7fdd37ba614",
        machine:
          "8C2B4CA076E57619E239958200FF18D4CFC0E931755C2648D66B36F2BD4D7E0B",
      },
    },

    "488c847c-b533-48db-931c-113e1ba35371": {
      name: "Consortium partner allowed to access algorithm",
      inputs: [
        {
          description: "Consortium UUID of data provider",
          name: "provider_consortium_uuid",
          source: "internal",
        },
        {
          description: "Consortium UUID of data consumer",
          name: "consumer_consortium_uuid",
          source: "internal",
        },
        {
          description: "Algorithm UUID",
          name: "algorithm_uuid",
          source: "internal",
        },
      ],
      outputs: [{ description: "Access allowed", name: "access_allowed" }],
      url: {
        human: "/policies/gdpr-attribution/README.txt",
        legal: "/policies/gdpr-attribution/POLICY.txt",
        machine: "/policies/gdpr-attribution/gdpr-attribution.eflint",
      },
      hash_type: "SHA-256",
      hash: {
        human:
          "e5e61f918d66cd421ee506dff43f713b3e74449a23d035b65b8115196d7397d9",
        legal:
          "d0119b1ff66c27f3973c0437bc2a19d426f6a5532313abca9cd9b7fdd37ba614",
        machine:
          "8C2B4CA076E57619E239958200FF18D4CFC0E931755C2648D66B36F2BD4D7E0B",
      },
    },

    "3a1c4ab9-3fe1-4b93-afc7-ebbd068afaa2": {
      name: "Ex Post checks",
      inputs: [
        {
          description: "Audit logs",
          name: "auditlogs",
          source: "internal",
        },
      ],
      outputs: [{ description: "Ex Post OK", name: "ex_post_ok" }],
      url: {
        human: "/policies/gdpr-attribution/README.txt",
        legal: "/policies/gdpr-attribution/POLICY.txt",
        machine: "/policies/gdpr-attribution/gdpr-attribution.eflint",
      },
      hash_type: "SHA-256",
      hash: {
        human:
          "e5e61f918d66cd421ee506dff43f713b3e74449a23d035b65b8115196d7397d9",
        legal:
          "d0119b1ff66c27f3973c0437bc2a19d426f6a5532313abca9cd9b7fdd37ba614",
        machine:
          "8C2B4CA076E57619E239958200FF18D4CFC0E931755C2648D66B36F2BD4D7E0B",
      },
    },
  },

  default_policies: {
    ingest: ["8cceff93-ac99-4d10-a121-35413e3bea5a"],
    data_usage: [
      "cc0c5381-3c43-4c64-86d9-770655ebb696",
      "21693473-d070-43bf-aca7-b75adbb51e48",
    ],
    ex_post: ["3a1c4ab9-3fe1-4b93-afc7-ebbd068afaa2"],
  },
};
