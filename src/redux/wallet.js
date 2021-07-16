import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletAddress: null,
    balances: {
      eth: {
        address: "0xD76b5c2A23ef78368d8E34288B5b65D616B746aE",
        balance: null,
      },
      "1inch": {
        address: "0x111111111117dc0aa78b770fa6a738034120c302",
        balance: null,
      },
      aave: {
        address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
        balance: null,
      },
      alcx: {
        address: "0xbc6da0fe9ad5f3b0d58160288917aa56653660e9",
        balance: null,
      },
      alpha: {
        address: "0xa1faa113cbe53436df28ff0aee54275c13b40975",
        balance: null,
      },
      amp: {
        address: "0xff20817765cb7f73d4bde2e66e067e58d11095c2",
        balance: null,
      },
      ampl: {
        address: "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
        balance: null,
      },
      ant: {
        address: "0xa117000000f279d81a1d3cc75430faa017fa5a2e",
        balance: null,
      },
      axs: {
        address: "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
        balance: null,
      },
      badger: {
        address: "0x3472a5a71965499acd81997a54bba8d852c6e53d",
        balance: null,
      },
      bal: {
        address: "0xba100000625a3754423978a60c9317c58a424e3d",
        balance: null,
      },
      band: {
        address: "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55",
        balance: null,
      },
      bask: {
        address: "0x44564d0bd94343f72e3c8a0d22308b7fa71db0bb",
        balance: null,
      },
      bnt: {
        address: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
        balance: null,
      },
      bond: {
        address: "0x0391d2021f89dc339f60fff84546ea23e337750f",
        balance: null,
      },
      combo: {
        address: "0xffffffff2ba8f66d4e51811c5190992176930278",
        balance: null,
      },
      comp: {
        address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
        balance: null,
      },
      core: {
        address: "0x62359ed7505efc61ff1d56fef82158ccaffa23d7",
        balance: null,
      },
      cvc: {
        address: "0x41e5560054824ea6b0732e656e3ad64e20e94e45",
        balance: null,
      },
      cream: {
        address: "0x2ba592f78db6436527729929aaf6c908497cb200",
        balance: null,
      },
      crv: {
        address: "0xd533a949740bb3306d119cc777fa900ba034cd52",
        balance: null,
      },
      dai: {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        balance: null,
      },
      dnt: {
        address: "0x0abdace70d3790235af448c88547603b945604ea",
        balance: null,
      },
      dough: {
        address: "0xad32a8e6220741182940c5abf610bde99e737b2d",
        balance: null,
      },
      dpi: {
        address: "0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b",
        balance: null,
      },
      dpx: {
        address: "0xeec2be5c91ae7f8a338e1e5f3b5de49d07afdc81",
        balance: null,
      },
      rdpx: {
        address: "0x0ff5a8451a839f5f0bb3562689d9a44089738d11",
        balance: null,
      },
      farm: {
        address: "0xa0246c9032bc3a600820415ae600c6388619a14d",
        balance: null,
      },
      meme: {
        address: "0xd5525d397898e5502075ea5e830d8914f6f0affe",
        balance: null,
      },
      gno: {
        address: "0x6810e776880c02933d47db1b9fc05908e5386b96",
        balance: null,
      },
      grt: {
        address: "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
        balance: null,
      },
      hegic: {
        address: "0x584bc13c7d411c00c01a62e8019472de68768430",
        balance: null,
      },
      k3pr: {
        address: "0x33518A786e2D6a40a2c78f2431A9385a32ca36D5",
        balance: null,
      },
      keep: {
        address: "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec",
        balance: null,
      },
      knc: {
        address: "0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202",
        balance: null,
      },
      ldo: {
        address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
        balance: null,
      },
      link: {
        address: "0x514910771af9ca656af840dff83e8264ecf986ca",
        balance: null,
      },
      loom: {
        address: "0x42476f744292107e34519f9c357927074ea3f75d",
        balance: null,
      },
      lrc: {
        address: "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
        balance: null,
      },
      mana: {
        address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
        balance: null,
      },
      mbbased: {
        address: "0x26cf82e4ae43d31ea51e72b663d26e26a75af729",
        balance: null,
      },
      mbtc: {
        address: "0x945facb997494cc2570096c74b5f66a3507330a1",
        balance: null,
      },
      mir: {
        address: "0x09a3ecafa817268f77be1283176b946c4ff2e608",
        balance: null,
      },
      mbaba: {
        address: "0x56aa298a19c93c6801fdde870fa63ef75cc0af72",
        balance: null,
      },
      mnflx: {
        address: "0xc8d674114bac90148d11d3c1d33c61835a0f9dcd",
        balance: null,
      },
      mtsla: {
        address: "0x21ca39943e91d704678f5d00b6616650f066fd63",
        balance: null,
      },
      mtwtr: {
        address: "0xedb0414627e6f1e3f082de65cd4f9c693d78cca9",
        balance: null,
      },
      mvixy: {
        address: "0xf72fcd9dcf0190923fadd44811e240ef4533fc86",
        balance: null,
      },
      mkr: {
        address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        balance: null,
      },
      mln: {
        address: "0xec67005c4e498ec7f55e092bd1d35cbc47c91892",
        balance: null,
      },
      mph: {
        address: "0x8888801af4d980682e47f1a9036e589479e835c5",
        balance: null,
      },
      mta: {
        address: "0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2",
        balance: null,
      },
      nmr: {
        address: "0x1776e1f26f98b1a5df9cd347953a26dd3cb46671",
        balance: null,
      },
      nu: {
        address: "0x4fe83213d56308330ec302a8bd641f1d0113a4cc",
        balance: null,
      },
      ohm: {
        address: "0x383518188c0c6d7730d91b2c03a03c837814a899",
        balance: null,
      },
      opium: {
        address: "0x888888888889c00c67689029d7856aac1065ec11",
        balance: null,
      },
      ousd: {
        address: "0x2a8e1e676ec238d8a992307b495b45b3feaa5e86",
        balance: null,
      },
      oxt: {
        address: "0x4575f41308ec1483f3d399aa9a2826d74da13deb",
        balance: null,
      },
      pickle: {
        address: "0x429881672b9ae42b8eba0e26cd9c73711b891ca5",
        balance: null,
      },
      premia: {
        address: "0x6399c842dd2be3de30bf99bc7d1bbf6fa3650e70",
        balance: null,
      },
      ren: {
        address: "0x408e41876cccdc0f92210600ef50372656052a38",
        balance: null,
      },
      repv2: {
        address: "0x1915cE14Bc5F0A4E9742D55b5f251ED71f4f3e96",
        balance: null,
      },
      rgt: {
        address: "0xd291e7a03283640fdc51b121ac401383a46cc623",
        balance: null,
      },
      rune: {
        address: "0x3155ba85d5f96b2d030a4966af206230e46849cb",
        balance: null,
      },
      snx: {
        address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
        balance: null,
      },
      spank: {
        address: "0x42d6622dece394b54999fbd73d108123806f6a18",
        balance: null,
      },
      srm: {
        address: "0x476c5e26a75bd202a9683ffd34359c0cc15be0ff",
        balance: null,
      },
      stake: {
        address: "0x0ae055097c6d159879521c384f1d2123d1f195e6",
        balance: null,
      },
      susd: {
        address: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
        balance: null,
      },
      sushi: {
        address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
        balance: null,
      },
      storj: {
        address: "0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac",
        balance: null,
      },
      tbtc: {
        address: "0x2cd1075682b0fccaadd0ca629e138e64015ba11c",
        balance: null,
      },
      torn: {
        address: "0x77777feddddffc19ff86db637967013e6c6a116c",
        balance: null,
      },
      tusd: {
        address: "0x0000000000085d4780b73119b644ae5ecd22b376",
        balance: null,
      },
      uma: {
        address: "0x04fa0d235c4abf4bcf4787af4cf447de572ef828",
        balance: null,
      },
      uni: {
        address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        balance: null,
      },
      usdc: {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        balance: null,
      },
      ust: {
        address: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
        balance: null,
      },
      usdt: {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        balance: null,
      },
      wnxm: {
        address: "0x0d438f3b5175bebc262bf23753c1e53d03432bde",
        balance: null,
      },
      yfi: {
        address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
        balance: null,
      },
      xsushi: {
        address: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
        balance: null,
      },
      yam: {
        address: "0x0aacfbec6a24756c20d41914f2caba817c0d8521",
        balance: null,
      },
      yeti: {
        address: "0xb4bebd34f6daafd808f73de0d10235a92fbb6c3d",
        balance: null,
      },
      yld: {
        address: "0xf94b5c5651c888d928439ab6514b93944eee6f48",
        balance: null,
      },
      zhegic: {
        address: "0x837010619aeb2ae24141605afc8f66577f6fb2e7",
        balance: null,
      },
      zlot: {
        address: "0xa8e7ad77c60ee6f30bac54e2e7c0617bd7b5a03e",
        balance: null,
      },
      zrx: {
        address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
        balance: null,
      },
    }
  },
  reducers: {
    setWalletAddress: (state, { payload }) => {
      const { walletAddress } = payload;
      state.walletAddress = walletAddress;

     
    },
    setWalletBalance: (state, {payload}) => {
      const {key, balance} = payload
      state.balances[key].balance = balance;
    }
  },
});

export const { setWalletAddress, setWalletBalance } = walletSlice.actions;

export default walletSlice.reducer;
