import { useDispatch } from 'react-redux';
import { encodePacked, keccak256, parseEther, type Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import { abi, bytecode } from '../contracts/rps';
import { generateRandomNonce } from '../libs/security';
import { GameCreatedPayload, gameCreated } from '../store/gamesSlice';

type CreateGameArgs = Omit<GameCreatedPayload, 'p1' | 'nonce' | 'contractTransaction'>;

/**
 * Custom hook that encapsulates the logic for creating a new game. When invoked the
 * returned function, it performs the following steps:
 * 1. Generates a random nonce and calculates the hash for the player move
 * 2. Deploys a new game smart contract
 * 3. Updates the Redux store accordingly
 *
 * @returns {Function} Generates nonce, deploys the smart contract and updates the state
 *
 * @example
 * const createGame = useCreateGame();
 *
 * await createGame({
 *   p2: '0x...',
 *   p1Weapon: Weapon.SCISSORS,
 *   stake: '1',
 * })
 */
export const useCreateGame = () => {
  const dispatch = useDispatch();
  const config = useConfig();

  return async (fields: CreateGameArgs) => {
    const client = await getWalletClient(config);
    const { address: myAddress } = getAccount(config);

    const nonce = generateRandomNonce();
    const weaponHash = keccak256(encodePacked(['uint8', 'uint256'], [fields.p1Weapon, BigInt(nonce)]));
    const stake = parseEther(String(fields.stake));

    const hash = await client.deployContract({
      abi,
      bytecode: bytecode,
      args: [weaponHash, fields.p2],
      value: stake,
    });

    dispatch(
      gameCreated({
        p1: myAddress as Hash,
        p2: fields.p2 as Hash,
        contractTransaction: hash,
        p1Weapon: fields.p1Weapon,
        nonce: nonce.toString(),
        stake: stake.toString(),
      }),
    );

    return hash;
  };
};
