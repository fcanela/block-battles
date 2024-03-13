# Technical overview

## How it works?

The applications state resides in a [Redux store](../src/store/gamesSlice.ts). That store is [unique per connected address](../src/providers/AccountStoreProvider.tsx#L33) and synchronized with LocalStorage thanks to `redux-persist`. Changing the active connected account loads the state for that account.

Creating a new game [deploys a new game contract](../src/hooks/useCreateGame.ts#L41). The transaction that creates the game contract [is used as game identifier](../src/store/gamesSlice.ts#L9), and can be used by Player 2 to [join the game](../src/hooks/useJoinGame.ts#L31).

The game refreshes [periodically the ongoing games](/src/components/GamesUpdater.tsx#L19) via the `GameUpdater` component, which uses the [`useUpdateGame` hook](../src/hooks/useUpdateGame.ts) for the task. A rough overview of the process:

1. If the contract address is not known
   1. It fetches the contract. If it is not deployed, skips until next update interval.
   2. [Validates the contract](../src/libs/security.ts#L7) using bytecode and Etherscan verified source code. If it fails, finishes the game as invalid.
2. Reads the game variables (Player 2 weapon, last action, current stored value/stakes, etc)
3. If it is possible that the game has finished (current stored value < initial stakes for betting games, anytime for betless):
   1. Retrieves the transactions in the relevant blocks for both players.
   2. Finds the first successful `solve` and timeout call. If exists, finishes the game accordingly.
4. When code reaches this point, it is either the turn to Player 2 to select a weapon (if none is yet selected) or Player 1 to reveal (if Player 2 has picked a weapon).

The application allow the user to interact without connecting until an action is performed. This is done via the [`useConnectable` hook](../src/hooks/useConnectable.ts), which ensures the user is connected to the expected chain before an action is performed.

## Structure

- `src/`
  - `assets/`: Images used through the application.
  - `components/`
  - `constants/`: Constant values reused through the application.
  - `contracts/`: Game contract ABI, bytecode, source code hash.
  - `hooks/`: Reusable/encapsulated logic that follows the React hook rules.
  - `libs/`: Reusable/encapsulated logic.
  - `pages/`: Top-level components per route.
  - `providers/`: React providers and their configuration.
  - `store/`: Redux state slices
- `.env`: Required environment variables for the application.
- `.env.example`: Blueprint for `.env` file. Copy this file as `.env` locally and fill the values.
- `netlify.yml`: Netlify deployment configuration
