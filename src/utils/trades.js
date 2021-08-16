import { ChainId, Token, Trade, TokenAmount, Pair, WETH } from "@uniswap/sdk";
import {
  convertAmountToString,
  createContract,
} from "./wallet";
import UniswapV2Router02ABI from "../helpers/abis/uniswapV2Router02.json";
import {
  sushiRouterContractAddress,
  uniV2Router02ContractAddress,
} from "../helpers/contracts";
import { checkIfPairExists, checkSumAddress } from "./webThreeUtils";
import { constants } from ".";

export const fetchBestTrades = async (dex, token1, token2, inputTokenAmount) => {

  if(token1.symbol === "eth"){
    token1 = WETH[ChainId.MAINNET];
  }
  if(token2.symbol === "eth"){
    token2 = WETH[ChainId.MAINNET];
  }
  const t1 = new Token(
    ChainId.MAINNET,
    checkSumAddress(token1.address),
    token1.decimals,
    token1.symbol.toUpperCase(),
    token1.name
  );
  const t2 = new Token(
    ChainId.MAINNET,
    checkSumAddress(token2.address),
    token2.decimals,
    token2.symbol.toUpperCase(),
    token2.name
  );

  console.log(inputTokenAmount);
  console.log(typeof inputTokenAmount);
  console.log(ChainId.MAINNET);
  console.log(t1);
  console.log(t2);

  const itAmount = new TokenAmount(token1, inputTokenAmount);

  await checkBestPriceTrades(dex, t1, t2, itAmount);
};

// Generates Trade Array with est possible Trade using SDK
export const checkBestPriceTrades = async (
  dex,
  inputToken,
  outputToken,
  inputTokenAmount,
) => {
  //check if pair exist
  let isPair = null;
  let pairs = null;

  console.log(inputToken);
  console.log(outputToken);

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

  console.log(isPair);
  if (isPair !== constants.ZERO_ADDRESS) {
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

  console.log(pairs);

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
