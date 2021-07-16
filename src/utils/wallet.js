import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWalletAddress, setWalletBalance } from "../redux/wallet";
import store from "../store";
import { getAllTokens } from "./token";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "ff43e90c13d042d6b641cab07b787fc8", // required
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

//web3modal if provider preexist add listener
(async () => {
  if (web3Modal.cachedProvider) {
    const provider = await web3Modal.connect();
    provider.on("accountsChanged", async (accounts) => {
      store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
      await fetchWalletTokenBalances();
    });
  }
})();

export const connectToWallet = async () => {
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  provider.on("accountsChanged", async (accounts) => {
    store.dispatch(setWalletAddress({ walletAddress: accounts[0] }));
    await fetchWalletTokenBalances();
  });
  return web3;
};

export const fetchWalletTokenBalances = async () => {
  //Add web3 logic to sent balnaces in payload (currently just mocks random value)
  if (web3Modal.cachedProvider)
    getAllTokens().forEach(async (token) => {
      store.dispatch(
        setWalletBalance({ key: token.tokenSymbol, balance: null })
      );
      setTimeout(() => {
        store.dispatch(
          setWalletBalance({
            key: token.tokenSymbol,
            balance: (Math.random() * 10).toFixed(2),
          })
        );
      }, 2000);
      await timer(2000);
    });
};
