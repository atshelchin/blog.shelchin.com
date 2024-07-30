# How to deploy Safe Wallet on a new blockchain
> This article was first published on https://devlog.fusionist.io/posts/how-to-deploy-safe-wallet-on-a-new-blockchain/

## Feeling discouraged

Three weeks ago, just like you, I felt both excited and a bit uneasy about deploying Safe Wallet. After continuous attempts and learning, I have finally mastered the skills of deploying and managing Safe Wallet. I am ready to share this process with you in this tutorial.

I will deploy Safe Wallet on the `Endurance` mainnet. The `Endurance` mainnet was successfully launched in January 2023, and it is a new Layer1 blockchain compatible with EVM. It provides a solid foundation for the Web3 AAA game [**Fusionist**](https://www.fusionist.io/). If you are planning to deploy Safe Wallet on this newly launched blockchain like me and want to inherit its accumulated reputation, then you have come to the right place. Additionally, if you are concerned about potential service disruptions with Safe Wallet and wish to quickly set up a backup system, this is also where your needs can be met.

![Overview of the backend services and their components.](https://docs.safe.global/_next/static/media/diagram-services.ebd13689.png)

The image source is: https://docs.safe.global/advanced/api-service-architecture

The diagram clearly illustrates the architecture of the Safe Wallet service. However, I believe it still overlooks three key components: first, the RPC service for EVM-compatible chains; second, the corresponding blockchain explorer service; and third, the complete suite of Safe Wallet smart contracts deployed on this chain.

You can access the following two websites to search for and obtain the necessary information about `Endurance`: https://chainlist.org/?search=endurance and https://github.com/ethereum-lists/chains/blob/master/_data/chains/eip155-648.json.

| Field Name         | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Chain name         | [Endurance Smart Chain Mainnet](https://chainlist.org/chain/648) |
| Chain Id           | 648                                                              |
| Currency symbol    | ACE                                                              |
| Public rpc uri     | https://rpc-endurance.fusionist.io                               |
| Block explorer uri | https://explorer.endurance.fusionist.io                          |

This tutorial consists of the following two topics:

1. How to deploy the complete Safe Wallet smart contract suite on the Endurance chain.
2. How to deploy the full Safe Wallet service for the Endurance chain.

## Safe Wallet smart contract

### How to deploy the complete Safe Wallet smart contract suite on the Endurance chain

In order to deploy Safe-related contracts on multiple blockchains, the first step is to deploy [safe-singleton-factory](https://github.com/safe-global/safe-singleton-factory), which is a singleton factory specifically designed for this purpose.

In previous discussions, we mentioned the desire to "inherit its accumulated reputation." From my perspective, the trustworthiness of a contract depends on whether its address is widely used and if its corresponding source code is open-source and has been audited by multiple independent parties. The official Safe contract meets these criteria. On a new blockchain, inheriting the accumulated reputation means wanting the newly deployed contract address to match that of the official Safe contract, thus naturally inheriting its reputation. To achieve this, you need to request Safe's officials to deploy a singleton factory on this new chain and ensure that when deploying the Safe wallet contract, they use the same version and git commit id.

For specific instructions on how to request the deployment of a singleton factory from officials, please refer to [Safe Developer Documentation](https://github.com/safe-global/safe-singleton-factory?tab=readme-ov-file#how-to-get-the-singleton-deployed-to-your-network).

After submitting the deployment request, it usually takes 1-2 weeks to receive official approval. However, Safewallet typically only approves deployment requests for the main network. If you wish to deploy or test on a local network or private network, you will need to deploy the `safe-singleton-factory` contract yourself. Below is the process I followed when deploying these test contracts:

### Compile and deploy safe-singleton-factory.

```shell
# Clone the source code repository
git clone https://github.com/safe-global/safe-singleton-factory.git
cd safe-singleton-factory

# Compile contract
yarn
yarn hardhat compile

# Copy .env
cp .env.sample .env

# Estimated Gas
yarn estimate-compile "https://rpc-endurance.fusionist.io"

# Deploy contract
yarn submit
```

Successfully deployed contract address: [0x181500A79F8e0dd760Bf6856c84440FC029ed7d4](https://explorer-endurance.fusionist.io/address/0x181500A79F8e0dd760Bf6856c84440FC029ed7d4)

### Compile and deploy safe-smart-account

```shell
# Clone the source code repository
git clone https://github.com/safe-global/safe-smart-account
cd safe-smart-account

# Switch to version 1.4.1 of the contract
git switch --detach tags/v1.4.1-build.0

# Compile contract
yarn
yarn build

# Copy .env
cp .env.sample .env

# Deploy contract
yarn hardhat --network custom deploy
```

Please note: If you want to deploy the `safe-smart-account` contract on the mainnet, you need to wait for Safe's official deployment of `safe-singleton-factory` on your mainnet.

Due to version `1.3.0` not relying on `safe-singleton-factory`, you will have a smoother experience.

If you encounter the following error during the deployment of version `1.4.1`:

```
Error:
        Safe factory not found for network 648. You can request a new deployment at https://github.com/safe-global/safe-singleton-factory.
        For more information, see https://github.com/safe-global/safe-contracts#replay-protection-eip-155
```

This typically means that the `safe-singleton-factory` contract address for your specified network is not included in the `@gnosis.pm/safe-singleton-factory` package. You will need to manually add the contract address to the corresponding directory at `node_modules/@gnosis.pm/safe-singleton-factory/artifacts`.

The following are detailed operational steps along with their annotations:

```shell
# Create a temporary directory to store the modified artifacts.
mkdir /tmp/safe-singleton-factory

# Copy the artifacts from the current node_modules to a temporary directory.
cp -r ./node_modules/@gnosis.pm/safe-singleton-factory/artifacts /tmp/safe-singleton-factory/artifacts

# Rename the current 'artifacts' directory to 'backup' for archival purposes.
mv ./node_modules/@gnosis.pm/safe-singleton-factory/artifacts ./node_modules/@gnosis.pm/safe-singleton-factory/artifacts-bak

# Create a symbolic link to point the "artifacts" folder in the "node_modules" directory to a temporary directory.
ln -s /tmp/safe-singleton-factory/artifacts ./node_modules/@gnosis.pm/safe-singleton-factory

# Verify if the symbolic link has been successfully created.
ls -l ./node_modules/@gnosis.pm/safe-singleton-factory/

# Create a directory for network ID 648.
mkdir /tmp/safe-singleton-factory/artifacts/648

# If the safe-global/safe-singleton-factory repository already contains your chain information.
wget -O /tmp/safe-singleton-factory/artifacts/648/deployment.json https://raw.githubusercontent.com/safe-global/safe-singleton-factory/main/artifacts/648/deployment.json

# If the safe-global/safe-singleton-factory repository does not have your chain information.
# You need to create a deployment.json file in the directory /tmp/safe-singleton-factory/artifacts/648 and fill it with the following content.
echo '{
	"gasPrice": "your tx gas price",
	"gasLimit": "your tx gas limit",
	"signerAddress": "your signer address",
	"transaction": "your signed tx",
	"address": "0x181500A79F8e0dd760Bf6856c84440FC029ed7d4"  # Your safe-singleton-factory contract address
}' > /tmp/safe-singleton-factory/artifacts/648/deployment.json
```

Please replace the following parameters with the specific details of your transaction: `your tx gas price`, `your tx gas limit`, `your signer address`, and `your signed tx`. You can obtain this information by visiting the following link: [0xa450888b56f3306861c64619cba67a8f54dbbe65bcb2ef0f1568cf81eba2139d](https://explorer-endurance.fusionist.io/tx/0xa450888b56f3306861c64619cba67a8f54dbbe65bcb2ef0f1568cf81eba2139d).

**Obtain `your signed tx`**

```shell
curl -X POST -H "Content-Type: application/json" --data '{
  "jsonrpc": "2.0",
  "method": "eth_getRawTransactionByHash",
  "params": ["0xa450888b56f3306861c64619cba67a8f54dbbe65bcb2ef0f1568cf81eba2139d"],
  "id": 1
}' https://rpc-endurance.fusionist.io
```

The value after my replacement is:

```shell
echo '{
	"gasPrice": "1500000007",
	"gasLimit": "96586",
	"signerAddress": "0x36C8403082Fc6dF260FCa47C5a0F2141D6840039",
	"transaction": "0xf8a6808459682f078301794a8080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820533a07941a82aae53b4ed2a63be73c72e221dac750305c5270cd69ad48cab0bfb10d6a04657e52a6fd68effa9f6c97a4533333644e86eac9fe30871b948b094b1e21b7a",
	"address": "0x181500A79F8e0dd760Bf6856c84440FC029ed7d4"
}' > /tmp/safe-singleton-factory/artifacts/648/deployment.json
```

After successful deployment, you will receive a series of contract addresses:

| Name                         | Address                                    |
| ---------------------------- | ------------------------------------------ |
| SimulateTxAccessor           | 0xF6279c34CCE816366C99CBa82bd5F632a4A719dA |
| SafeProxyFactory             | 0xEEaf16382cf9C0B7E54aaDe3808CCcEa781c5D75 |
| TokenCallbackHandler         | 0x6086C2BBdC29f95D0F9A6aE16dE775924B625cA9 |
| CompatibilityFallbackHandler | 0x7f5FAc1F9dA9ac60922aD92f056BA017e55637be |
| CreateCall                   | 0x891Ac56A4Be16937d48AAF1C9949940a595EB107 |
| MultiSend                    | 0x4aa2bbf5dB392Cbb5414A69681c3d3D51A75E9f4 |
| MultiSendCallOnly            | 0x670C469Be8C52B3d0f5003311a09E35AeABA3ba0 |
| SignMessageLib               | 0x6ba3c425CbF72D43723Aa61224E9B0cd9b49Bb85 |
| SafeL2                       | 0x7de94E90A09E70b85AC2B47d39bCcFe968DCE58C |
| Safe                         | 0xBB6e90eBF1cF74af708c160E622A87d40A9AC388 |

## Safe Wallet service

### How to deploy the full Safe Wallet service for the Endurance chain

```shell
# Clone the source code repository
git clone https://github.com/OpenFusionist/how-to-self-host-safe-wallet.git
cd how-to-self-host-safe-wallet/safewallet

# Copy .env
cp .env.sample .env

# Start
docker network create safe_shared_network
docker compose -f docker-compose.core.yml -f docker-compose.tx.yml up -d
```

### Add the `Endurance` chain in the safe-config-service.

Introduction: https://docs.safe.global/advanced/api-service-architecture

URL: http://localhost:8008/cfg/admin/chains/chain/add/

Refer to the following table:

<!--
| Field Name                          | Value                                                        |
| ----------------------------------- | ------------------------------------------------------------ |
| Chain Id                            | 648                                                          |
| Chain name                          | Endurance Smart Chain Mainnet                                |
| EIP-3770 short name                 | ace                                                          |
| Chain logo uri                      |                                                              |
| L2                                  |                                                              |
| Rpc uri                             | https://rpc-endurance.fusionist.io                           |
| Safe apps rpc uri                   | https://rpc-endurance.fusionist.io                           |
| Public rpc uri                      | https://rpc-endurance.fusionist.io                           |
| Block explorer uri address template | https://explorer-endurance.fusionist.io/address/{{address}}  |
| Block explorer uri tx hash template | https://explorer-endurance.fusionist.io/tx/{{txHash}}        |
| Block explorer uri api template     | https://explorer-endurance.fusionist.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}} |
| Currency name                       | ACE                                                          |
| Currency symbol                     | ACE                                                          |
| Currency logo uri                   |                                                              |
| Transaction service uri             | http://nginx:8000/txs                                        |
| Vpc transaction service uri         | http://nginx:8000/txs                                        |
| Recommended master copy version     | 1.4.1                                                        |
| FEATURE                             | Chain Feature:SAFE_APPS                                      |
|                                     |                                                              | -->

### Add a Safe App in the safe-config-service.

URL: http://localhost:8008/cfg/admin/safe_apps/safeapp/add/

Refer to the following table:

| Field Name  | Value                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| Url         | https://apps-portal.safe.global/tx-builder                                    |
| Name        | Transaction Builder                                                           |
| Icon url    |                                                                               |
| Description | Compose custom contract interactions and batch them into a single transaction |
| Chain ids   | 648                                                                           |
| TAG         | dashboard-widgets、transaction-builder、Infrastructure                        |
| FEATURE     | BATCHED_TRANSACTIONS                                                          |

### Add a proxy factory to the safe-transaction-service.

Introduction：https://docs.safe.global/advanced/api-service-architecture

URL: http://localhost:8008/txs/admin/history/proxyfactory/

Refer to the following table:

| Field Name           | Value                                      |
| -------------------- | ------------------------------------------ |
| Address              | 0xEEaf16382cf9C0B7E54aaDe3808CCcEa781c5D75 |
| Initial block number | 553430                                     |
| Tx block number      | 553430                                     |

### Add the master copy to the safe transaction service.

> What is master copies

> It refers to the address of the [gnosis_safe](https://github.com/safe-global/safe-deployments/blob/4a309662615ab48b855a69323665b9b8394362f5/src/assets/v1.4.1/safe.json) contract. If selecting L2, then fill in the [gnosis_safe_l2](https://github.com/safe-global/safe-deployments/blob/4a309662615ab48b855a69323665b9b8394362f5/src/assets/v1.4.1/safe_l2.json) address.

URL: http://localhost:8008/txs/admin/history/safemastercopy/

Refer to the following table:

| Field Name           | Value                                      |
| -------------------- | ------------------------------------------ |
| Address              | 0x7de94E90A09E70b85AC2B47d39bCcFe968DCE58C |
| Initial block number | 553437                                     |
| Tx block number      | 553437                                     |
| Version              |                                            |
| L2                   |                                            |

🎉 Congratulations! The Safe Wallet service is now fully launched and you can access the Safe Web App through [http://localhost:8008](http://localhost:8008/).

If you need to deploy Safe Wallet on another chain, simply follow the steps above: first deploy the smart contract suite, then start the full Safe Wallet service. This way, you can easily expand to a new blockchain network!
