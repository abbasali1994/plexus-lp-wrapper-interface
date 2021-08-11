import { ChainId, Token, Trade, TokenAmount, Pair, WETH } from "@uniswap/sdk";
import {
  checkIfPairExists,
  convertAmountToString,
  createContract,
} from "./wallet";
import UniswapV2Router02ABI from "../helpers/abis/uniswapV2Router02.json";
import {
  sushiRouterContractAddress,
  uniV2Router02ContractAddress,
} from "../helpers/contracts";
import { constants } from ".";

export const fetchBestTrades = async (dex, amount, lptoken1, lptoken2) => {
  const token1 = new Token(
    ChainId.MAINNET,
    lptoken1.address,
    lptoken1.decimals,
    lptoken1.symbol,
    lptoken1.name
  );
  const token2 = new Token(
    ChainId.MAINNET,
    lptoken2.address,
    lptoken2.decimals,
    lptoken2.symbol,
    lptoken2.name
  );
  const inputTokenAmount = new TokenAmount(
    token2,
    amount * (10 ** token1.decimals).toString()
  );
  await checkBestPriceTrades(dex, token1, inputTokenAmount, token2);
};

// Generates Trade Array with est possible Trade using SDK
export const checkBestPriceTrades = async (
  dex,
  outputToken,
  inputTokenAmount,
  inputToken
) => {
  //check if pair exist
  let isPair = null;
  let pairs = null;

  switch (dex) {
    case constants.dexUni:
      isPair = await checkIfPairExists(
        constants.dexUni,
        outputToken.address,
        inputToken.address
      );
      break;
    case constants.dexSushi:
      isPair = await checkIfPairExists(
        constants.dexUni,
        outputToken.address,
        inputToken.address
      );
      break;
    default:
      isPair = null;
  }
  if (isPair) {
    pairs = [
      new Pair(
        new TokenAmount(outputToken, "2000000000000000000"),
        new TokenAmount(inputToken, "2000000000000000000")
      ),
    ];
  } else {
    let pair1 = new Pair(
      new TokenAmount(outputToken, "2000000000000000000"),
      new TokenAmount(WETH[ChainId.MAINNET], "2000000000000000000")
    );
    let pair2 = new Pair(
      new TokenAmount(WETH[ChainId.MAINNET], "2000000000000000000"),
      new TokenAmount(inputToken, "2000000000000000000")
    );
    pairs = [pair1, pair2];
  }

  const bestTrades = Trade.bestTradeExactIn(
    pairs,
    inputTokenAmount,
    outputToken,
    { maxNumResults: 3, maxHops: 3 }
  );
  console.log(bestTrades);
};

// Calculates maximum amount of output token possible to recieve on swap using router contract
export const calcMaxAmountOuts = async (
  dex,
  amount,
  outputToken,
  inputToken
) => {
  //check if pair exist
  let isPair = null;
  let pairs = null;
  let router = null;
  switch (dex) {
    case constants.dexUni:
      isPair = await checkIfPairExists(
        constants.dexUni,
        outputToken.address,
        inputToken.address
      );
      router = createContract(
        UniswapV2Router02ABI,
        uniV2Router02ContractAddress
      );
      break;
    case constants.dexSushi:
      isPair = await checkIfPairExists(
        constants.dexSushi,
        outputToken.address,
        inputToken.address
      );
      router = createContract(UniswapV2Router02ABI, sushiRouterContractAddress);
      break;
    default:
      isPair = null;
  }
  if (!isPair) return;
  if (isPair === constants.ZERO_ADDRESS) {
    pairs = [inputToken.address, constants.WETH_ADDRESS, outputToken.address];
    console.log(pairs);
  } else {
    pairs = [inputToken.address, outputToken.address];
  }

  let inputamount = convertAmountToString(amount, inputToken.decimals);
  const amounts = await router.methods.getAmountsOut(inputamount, pairs).call();
  const outputIndex = amounts.length - 1;
  console.log(
    "Input Amount",
    parseFloat(amounts[0]) / 10 ** inputToken.decimals
  );
  console.log(
    "Output Amount",
    parseFloat(amounts[outputIndex]) / 10 ** outputToken.decimals
  );
};
