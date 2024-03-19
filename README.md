# [Block Battles](https://block-battles.netlify.app/)

> On-chain Rock, Paper, Scissors, Lizard, Spock bets

Two players DApp to play the extended version of the Rock, Paper, Scissors game,
with betting. There is a deployed version at [https://block-battles.netlify.app/](https://block-battles.netlify.app/)

A [technical overview document](./docs/technical-overview.md) provides a quick introduction to the codebase.

## Features

- **Bet a decentralized manner**. Deploys a game smart contract for both sides to interact.
- **Create a new game or join an existing one.**
- **Validated contract interactions**. Verifies the contract's authenticity to ensure you join a fair and legitimate game. Uses the bytecode when available ~and Etherscan verified contract source code as fallback~
  (no longer valid; I disabled the injected provider, which was using light nodes, and now it relies only on bytecode, which is more robust).
- **Play multiple games at the same time.**
- **Use multiple accounts.** Keep track of your games between different
  accounts. Games are persisted locally per connected account, with automatic switching.
- **Winner resolution.** Uses Etherscan API to resolve all scenarios' game choices and outcomes.
- ** HTTPS only **. It is served via Netlify, which uses HSTS to force SSL connections and reduces attackers' ability to inject malicious code that compromises fair game.
- **Secure nonce generation.** Uses `crypto.getRandomValues` as the generator.
- **Multiple providers.**. Uses Infura, Alchemy, and ANKR providers. You should not lose your bet just because an apocalypse resulted in two providers being down.

## Installation

1. Copy the `.env.example` into `.env` and fill the fields.
2. Install the dependencies with `npm install`.
3. Run the script for the desired environment

- `npm run build` to generate a production build
- `npm run dev` to start the development environment server

## Technical stack

- React
- Wagmi
- RainbowKit
- Alchemy and Etherscan APIs
- TailwindCSS

## License

MIT. Attribution to third parties is present in the application FAQ section.
