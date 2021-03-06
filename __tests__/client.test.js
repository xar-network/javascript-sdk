import XarClient from "../src"
import { checkNumber } from "../src/utils/validateHelper"
import * as crypto from "../src/crypto"
import Transaction from "../src/tx"
import { voteOption } from "../src/gov/"

/* make sure the address from the mnemonic has balances, or the case will failed */
const mnemonic = "outdoor typical inspire firm curtain rich favorite before owner switch club sheriff design alone upset undo void reason squeeze anchor pencil chest grief catalog"

const keystores = {
  // keystore with sha3 mac
  new: { "version": 1, "id": "73a811d0-5e31-4a0e-9b3a-a2a457ccbd7b", "crypto": { "ciphertext": "3b", "cipherparams": { "iv": "56d59d999578a0364c59934128dd215d" }, "cipher": "aes-256-ctr", "kdf": "pbkdf2", "kdfparams": { "dklen": 32, "salt": "781849b3477252928cfbe5d62180a755dce1e5b2569b02f6f14e7f46a0740687", "c": 262144, "prf": "hmac-sha256" }, "mac": "6a967b9dad5062eac3dbc9db4e30a8f2efa60f60403aa9ea0345e50cdfb5e9d86343f5808b7e2f51b062f7c7f24189723acd4a94568e6a72bb63e6345e988c0f" } },
  // keystore with sha256 mac
  legacy: { "version": 1, "id": "dfb09873-f16f-48c6-a6b8-bb5a705c47a7", "address": "bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk", "crypto": { "ciphertext": "33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b", "cipherparams": { "iv": "88c726d70cd0437bfdb2312dc60103fc" }, "cipher": "aes-256-ctr", "kdf": "pbkdf2", "kdfparams": { "dklen": 32, "salt": "ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9", "c": 262144, "prf": "hmac-sha256" }, "mac": "f7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e" } },
  // keystore with bad mac
  badMac: { "version": 1, "id": "dfb09873-f16f-48c6-a6b8-bb5a705c47a7", "address": "bnc1dxj068zgk007fchefj9n8tq06pcuce5ypqm5zk", "crypto": { "ciphertext": "33b7439a8d64d73357dc91f88a6b3a45e7303717664d17daf8e8dc1cc708fa4b", "cipherparams": { "iv": "88c726d70cd0437bfdb2312dc60103fc" }, "cipher": "aes-256-ctr", "kdf": "pbkdf2", "kdfparams": { "dklen": 32, "salt": "ad10ef544417d4a25914dec3d908882686dd9d793b5c484b76fd5aa575cf54b9", "c": 262144, "prf": "hmac-sha256" }, "mac": "x7cc301d18c97c71741492b8029544952ad5567a733971deb49fd3eb03ee696e" } },
}

const targetAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

const getClient = async (useAwaitSetPrivateKey = true, doNotSetPrivateKey = false) => {
  const client = new XarClient("https://node.xar.network/")
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
  if (!doNotSetPrivateKey) {
    if (useAwaitSetPrivateKey) {
      await client.setPrivateKey(privateKey)
    } else {
      client.setPrivateKey(privateKey) // test without `await`
    }
  }
  // use default delegates (signing, broadcast)
  client.useDefaultSigningDelegate()
  client.useDefaultBroadcastDelegate()
  return client
}

const wait = ms => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}

beforeEach(() => {
  jest.setTimeout(50000)
})


it("get all proposals", async () => {
  const client = await getClient(true)
  const res = await client.getAllProposals()
  expect(res.status).toBe(200)
})

it("get specific proposals", async () => {
  const client = await getClient(true)
  const res = await client.getProposal("1")
  expect(res.status).toBe(200)
})

it("gov vote", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Gov.vote("1","Yes","xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})


/*it("get all delegator rewards", async () => {
  const client = await getClient(true)
  const res = await client.getDelegatorRewards("xar1yxd5lulpylvnzq3mkxs4jgpre3zp3eym2ptpcw")
  expect(res.status).toBe(200)
})

it("withdraw rewards", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const validatorAddress = "xva1x3zca7yvrrnycqy4vc895m4t8djud0lru6qwfy"

  const msg = client.Distribution.withdrawDelegatorRewards(
    fromAddress,
    validatorAddress,
  )
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("get all delegations", async () => {
  const client = await getClient(true)
  const res = await client.getAllDelegations("xar1yxd5lulpylvnzq3mkxs4jgpre3zp3eym2ptpcw")
  expect(res.status).toBe(200)
})

it("get all unbonding delegations", async () => {
  const client = await getClient(true)
  const res = await client.getAllUnbondingDelegations("xar1yxd5lulpylvnzq3mkxs4jgpre3zp3eym2ptpcw")
  expect(res.status).toBe(200)
})

it("get all bonded validators", async () => {
  const client = await getClient(true)
  const res = await client.getAllBondedValidators("xar1yxd5lulpylvnzq3mkxs4jgpre3zp3eym2ptpcw")
  expect(res.status).toBe(200)
})

it("get all validators", async () => {
  const client = await getClient(true)
  const res = await client.getAllValidators()
  expect(res.status).toBe(200)
})

it("create validator", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const validatorAddress = "xva1x3zca7yvrrnycqy4vc895m4t8djud0lru6qwfy"

  const msg = client.Staking.createValidator(
    "moniker",
    "identity",
    "website",
    "security_contact",
    "details",
    "0.10",
    "0.20",
    "0.01",
    "1",
    fromAddress,
    validatorAddress,
    "pub_key",
    "ucsdt",
    "1000000"
  )
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("edit validator", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const validatorAddress = "xva1x3zca7yvrrnycqy4vc895m4t8djud0lru6qwfy"

  const msg = client.Staking.editValidator(
    "moniker",
    "identity",
    "website",
    "security_contact",
    "details",
    validatorAddress,
    "0.10",
    "1000000"
  )
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("delegate", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const validatorAddress = "xva1x3zca7yvrrnycqy4vc895m4t8djud0lru6qwfy"

  const msg = client.Staking.delegate(
    fromAddress,
    validatorAddress,
    "ucsdt",
    "1000000"
  )
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("undelegate", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const validatorAddress = "xva1x3zca7yvrrnycqy4vc895m4t8djud0lru6qwfy"

  const msg = client.Staking.undelegate(
    fromAddress,
    validatorAddress,
    "ucsdt",
    "1000000"
  )
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("get csdt parameters", async () => {
  const client = await getClient(true)
  const res = await client.getCSDTParameters()
  expect(res.status).toBe(200)
})

it("get oracle assets", async () => {
  const client = await getClient(true)
  const res = await client.getOracleAssets()
  try {
    console.log(JSON.stringify(res))
  } catch (err) {

  }
  expect(res.status).toBe(200)
})

it("add collateral", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.CSDT.depositCollateral(fromAddress, "tst", "1000000")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("withdraw collateral", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.CSDT.withdrawCollateral(fromAddress, "tst", "1000000")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("settle debt", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.CSDT.settleDebt(fromAddress, "tst", "csdt", "1000000")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("withdraw debt", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.CSDT.withdrawDebt(fromAddress, "tst", "csdt", "1000000")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("post price", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Oracle.postPrice(fromAddress, "tst", "0.1", "10000")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("add oracle", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Oracle.addOracle(fromAddress, fromAddress, "tst")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("set oracles", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Oracle.setOracles(fromAddress, [{address:fromAddress}], "tst")
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("set asset for oracle", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Oracle.setAsset(fromAddress, "tst", "tst", "tst", "zar", [{address:fromAddress}], true)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("add asset to oracle", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Oracle.addAsset(fromAddress, "tst", "tst", "tst", "zar", [{address:fromAddress}], true)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("issue native denom", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Denominations.issueToken(fromAddress, fromAddress, "TEST", "tst", "TST", "21000000", "21000000000", true)
  const res = await client.sendTx(msg, fromAddress)
  console.log(res.result)
  expect(res.status).toBe(200)
})

it("mint native denom", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Denominations.mintCoins(fromAddress, "tst", "100000000")
  const res = await client.sendTx(msg, fromAddress)
  console.log(res.result)
  expect(res.status).toBe(200)
})

it("burn native denom", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Denominations.burnCoins(fromAddress, "tst", "100000000")
  const res = await client.sendTx(msg, fromAddress)
  console.log(res.result)
  expect(res.status).toBe(200)
})

it("freeze native denom", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Denominations.freezeCoins(fromAddress, "tst", "100000000", fromAddress)
  const res = await client.sendTx(msg, fromAddress)
  console.log(res.result)
  expect(res.status).toBe(200)
})

it("unfreeze native denom", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Denominations.unfreezeCoins(fromAddress, "tst", "100000000", fromAddress)
  const res = await client.sendTx(msg, fromAddress)
  console.log(res.result)
  expect(res.status).toBe(200)
})

it("get tokens", async () => {
  const client = await getClient(true)
  const res = await client.getTokens()
  try {
    console.log(JSON.stringify(res))
  } catch (err) {

  }
  expect(res.status).toBe(200)
})

it("get token", async () => {
  const client = await getClient(true)
  const res = await client.getToken("uftm")
  try {
    console.log(JSON.stringify(res))
  } catch (err) {

  }
  expect(res.status).toBe(200)
})


it("get account", async () => {
  const client = await getClient(true)
  const res = await client.getAccount("xar14nh6rs0wyxl8t6rlv962dsv5sg644xj7d9h6jq")
  try {
    console.log(JSON.stringify(res))
  } catch (err) {

  }
  expect(res.status).toBe(200)
})

it("get node info", async () => {
  const client = await getClient(true)
  const res = await client.getNodeInfo()
  expect(res.status).toBe(200)
})

it("get supply", async () => {
  const client = await getClient(true)
  const res = await client.getSupply()
  expect(res.status).toBe(200)
})

it("get validators", async () => {
  const client = await getClient(true)
  const res = await client.getValidators()
  expect(res.status).toBe(200)
})

it("get staking parameters", async () => {
  const client = await getClient(true)
  const res = await client.getStakingParameters()
  expect(res.status).toBe(200)
})

it("get minting parameters", async () => {
  const client = await getClient(true)
  const res = await client.getMintinParameters()
  expect(res.status).toBe(200)
})

it("get inflation", async () => {
  const client = await getClient(true)
  const res = await client.getInflation()
  expect(res.status).toBe(200)
})

it("get assets", async () => {
  const client = await getClient(true)
  const res = await client.getAssets()
  expect(res.status).toBe(200)
})

it("get tx", async () => {
  const client = await getClient(true)
  const res = await client.getTx("8A80D64C536B496D91FE9C1707706B2AE887F60138CD5BA9550E4D3385D998CA")
  expect(res.status).toBe(200)
})

it("get account", async () => {
  const client = await getClient(true)
  const res = await client.getAccount("xar14nh6rs0wyxl8t6rlv962dsv5sg644xj7d9h6jq")
  expect(res.status).toBe(200)
})

it("get current price", async () => {
  const client = await getClient(true)
  const res = await client.getCurrentPrice("uftm")
  expect(res.status).toBe(200)
})

it("get csdt", async () => {
  const client = await getClient(true)
  const res = await client.getCSDT("xar1n4avxelsujq8chr7jh2qgf4gcttuxkxdv40rdj","uftm")
  expect(res.status).toBe(200)
})

it("csdt", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const collateralDenom = "uftm"
  const collateralChange = "10000"
  const debtChange = "100"

  const msg = client.CSDT.createOrModifyCSDT(fromAddress, collateralDenom, collateralChange, debtChange)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("record immutable proof", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const name = "123"
  const author = "bob"
  const hash = "e1273esa"
  const recordNo = "1"
  const recordType = "123"
  const description = "lorem ipsum"

  const msg = client.Record.record(fromAddress, name, author, hash, recordNo, recordType, description)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})


it("mint tokens liquidity provider", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const amount = [{
      denom: 'uftm',
      amount: '1000'
  }]

  const msg = client.LiquidityProvider.mintTokens(fromAddress, amount)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("burn tokens liquidity provider", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const amount = [{
      denom: 'uftm',
      amount: '1000'
  }]

  const msg = client.LiquidityProvider.burnTokens(fromAddress, amount)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("increase credit", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const liquidityProvider = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const creditIncrease = [{
      denom: 'uftm',
      amount: '1000'
  }]

  const msg = client.Issuer.increaseCredit(fromAddress, liquidityProvider, creditIncrease)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("decrease credit", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const liquidityProvider = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const creditDecrease = [{
      denom: 'uftm',
      amount: '1000'
  }]


  const msg = client.Issuer.decreaseCredit(fromAddress, liquidityProvider, creditDecrease)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("revoke liquidity provider", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const liquidityProvider = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Issuer.revokeLiquidityProvider(fromAddress, liquidityProvider)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("create issuer", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const issuer = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const denominations = ["uftm"]

  const msg = client.Authority.createIssuer(fromAddress, issuer, denominations)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("destroy issuer", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const issuer = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Authority.destroyIssuer(fromAddress, issuer)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("create oracle", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const oracleAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"

  const msg = client.Authority.createOracle(fromAddress, oracleAddress)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("create market", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const baseAsset = "uftm"
  const quoteAsset = "ucsdt"

  const msg = client.Authority.createMarket(fromAddress, baseAsset, quoteAsset)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("ensures that the number is positive", async () => {
  expect(() => checkNumber(-100, "-100")).toThrowError("-100 should be a positive number")
})

it("ensures that the number is less than 2^63", async () => {
  expect(() => checkNumber(Math.pow(2, 63), "2^63")).toThrowError("2^63 should be less than 2^63")
  expect(() => checkNumber(Math.pow(2, 63) + 1, "2^63")).toThrowError("2^63 should be less than 2^63")
})


it("transfer tokens", async () => {
  const client = await getClient(false)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  const res = await client.transfer(addr, targetAddress, 1, "coin174876e800", "hello world")
  expect(res.status).toBe(200)
})

it("issue token", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const symbol = "MINT"
  const tokenName = "test issue token"
  const totalSupply = 21000000

  const msg = client.Issue.issue(fromAddress, tokenName, symbol, totalSupply, false)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("mint token", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const to = "xar13jnw7klahe60tzu70a8mwg5qcf8444uwha9tma"
  const symbol = "coin174876e800"
  const amount = 10000000

  const msg = client.Issue.mint(fromAddress, symbol, amount, to)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("burn token", async () => {
  const client = await getClient(true)
  const fromAddress = "xar13slrtrkn4hmhu88nlzhnk5s36t54wsugkvttg5"
  const symbol = "coin174876e800"
  const amount = 10000

  const msg = client.Issue.burn(fromAddress, symbol, amount)
  const res = await client.sendTx(msg, fromAddress)
  expect(res.status).toBe(200)
})

it("create account", async () => {
  const client = await getClient(false)
  const res = client.createAccount()
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("create account with keystore", async () => {
  const client = await getClient(false, true)
  const res = client.createAccountWithKeystore("12345678")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
  expect(res.keystore).toBeTruthy()
})

it("create account with mnemonic", async () => {
  const client = await getClient(false)
  const res = client.createAccountWithMneomnic()
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
  expect(res.mnemonic).toBeTruthy()
})

it("recover account from legacy (sha256) keystore", async () => {
  const client = await getClient(false, true)
  const res = client.recoverAccountFromKeystore(keystores.legacy, "12345qwert!S")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from bad mac keystore", async () => {
  const client = await getClient(false, true)
  expect(() => {
    client.recoverAccountFromKeystore(keystores.badMac, "12345qwert!S")
  }).toThrowError()
})

it("recover account from mneomnic", async () => {
  jest.setTimeout(50000)
  const client = await getClient(false)
  const res = client.recoverAccountFromMneomnic(mnemonic)
  await (1500)
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
  console.log(res)
})

it("recover account from privatekey", async () => {
  jest.setTimeout(50000)
  const client = await getClient(false)
  const pk = crypto.generatePrivateKey()
  const res = client.recoverAccountFromPrivateKey(pk)
  await (1500)
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("get balance", async () => {
  const client = await getClient(false)
  const res = await client.getBalance(targetAddress)
  expect(res.length).toBeGreaterThanOrEqual(0)
})

it("transfer tokens", async () => {
  const client = await getClient(false)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)
  const account = await client._httpClient.request("get", `/bank/balances/${addr}`)
  const sequence = account.result && account.result.sequence

  const res = await client.transfer(addr, targetAddress, 1, "ftm", "hello world", sequence)
  console.log(res)
  expect(res.status).toBe(200)
})

it("get account", async () => {
  const client = await getClient(false)
  const res = await client.getAccount(targetAddress)
  if (res.status === 200) {
    expect(res.status).toBe(200)
  } else {
    expect(res.status).toBe(204)
  }
})

it("get balance no arg", async () => {
  const client = await getClient(false)
  const balances = await client.getBalance()
  expect(balances.length).toBeGreaterThan(-1)
})

it("check number when transfer", async () => {
  const client = await getClient(true)
  const addr = crypto.getAddressFromPrivateKey(client.privateKey)

  const account = await client._httpClient.request("get", `/bank/balances/${addr}`)
  const sequence = account.result && account.result.sequence

  try {
    await client.transfer(addr, targetAddress, -1, "ftm", "hello world", sequence)
  } catch (err) {
    expect(err.message).toBe("amount should be a positive number")
  }

  try {
    await client.transfer(addr, targetAddress, Math.pow(2, 63), "ftm", "hello world", sequence)
  } catch (err) {
    expect(err.message).toBe("amount should be less than 2^63")
  }
})*/
