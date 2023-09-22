Front end of the insurance smart contract 

Insurance Smart Contract Front End

This project is a front-end application built using Next.js for interacting with an insurance smart contract. It provides three pages: one for the insurance company, one for the validator, and one for the insured.

Features

Insurance Company Page: 

This page allows the insurance company to create and manage insurance policies. They can add new policies, view existing policies, and update policy details.

Validator Page: 

The validator page is designed for the validator role in the insurance contract. Validators can review and approve policies submitted by the policyholder. 

Insured Page: 

The insured page provides an interface for policyholders to view their insurance policies, make payment of premiums, and make claims if needed.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Usage

1. Run your local blockchain with the lottery code

> In a different terminal / command line

```
git clone https://github.com/kowitinelson2/Insurance-smart-contract
cd hardhat-fund-me-fcc
yarn 
yarn hardhat node
```

> You can read more about how to use that repo from its [README.md](https://github.com/kowitinelson2/Insurance-smart-contract/README.md)


2. Add hardhat network to your metamask/wallet

- Get the RPC_URL of your hh node (usually `http://127.0.0.1:8545/`)
- Go to your wallet and add a new network. [See instructions here.](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)
  - Network Name: Hardhat-Localhost
  - New RPC URL: http://127.0.0.1:8545/
  - Chain ID: 31337
  - Currency Symbol: ETH (or GO)
  - Block Explorer URL: None

Ideally, you'd then [import one of the accounts](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) from hardhat to your wallet/metamask. 

3. Run this code

Back in a different terminal with the code from this repo, run:

```
yarn dev
```

4. Go to UI and have fun!

Head over to your [localhost](http://localhost:3000) and play with the lottery!


