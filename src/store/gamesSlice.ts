import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Hash } from 'viem';
import { Stage } from '../constants/stages';
import { Player } from '../constants/player';
import { Weapon } from '../constants/weapons';
import { GameResult } from '../constants/game_result';

export type Games = {
  [transactionHash: Hash]: GameState;
};

export type GameState = {
  contractTransaction: Hash;
  stage: Stage;
  player: Player;
  turnOf: Player | null;
  p1: Hash;
  p2: Hash;
  p1Weapon?: Weapon;
  p2Weapon?: Weapon;
  nonce?: string;
  contractAddress?: Hash;
  stake: string;
  storedValue?: string;
  result?: GameResult;
  lastAction?: string;
  isPlayerLate?: boolean;
  lateAt?: string;
  updatedAt: string;
  joinedAt: string;
};

type ContractTransactionPayload = Pick<GameState, 'contractTransaction'>;
type LastActionPayload = Required<Pick<GameState, 'lastAction'>>;

export type GameCreatedPayload = ContractTransactionPayload & {
  p1: Hash;
  p2: Hash;
  p1Weapon: Weapon;
  nonce: string;
  stake: string;
};
export type GameJoinedPayload = { player: Player } & Omit<GameCreatedPayload, 'p1Weapon' | 'nonce'>;
export type GameStartedPayload = ContractTransactionPayload & {
  isPlayerLate: boolean;
};

export type ContractDeployedPayload = ContractTransactionPayload & {
  contractAddress: Hash;
};

export type P2MoveSentPayload = ContractTransactionPayload & {
  p2Weapon: Weapon;
};

export type P2MovedPayload = P2MoveSentPayload & LastActionPayload;
export type PlayerIsLatePayload = ContractTransactionPayload & {
  isPlayerLate: boolean;
};

export type GameFinishedPayload = ContractTransactionPayload & {
  result: GameResult;
  nonce?: string;
  p1Weapon?: Weapon;
};

export type ContractVariablesReadPayload = ContractTransactionPayload & {
  storedValue: string;
  p2Weapon: Weapon;
  lastAction: string;
};

export type GameStageChangedPayload = ContractTransactionPayload & {
  stage: Stage;
};

export type P2WeaponChangedPayload = ContractTransactionPayload & {
  weapon: Weapon;
};

type TurnByStage = {
  [key in Stage]?: Player;
};

const turnByStage: TurnByStage = {
  [Stage.STARTED]: Player.P2,
  [Stage.P2_MOVED]: Player.P1,
};

const initialState: Games = {};

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    contractVariablesRead: (state, action: PayloadAction<ContractVariablesReadPayload>) => {
      const { contractTransaction, ...fields } = action.payload;

      state[contractTransaction] = {
        ...state[contractTransaction],
        ...fields,
        updatedAt: new Date().toISOString(),
      };

      return state;
    },
    stageChanged: (state, action: PayloadAction<GameStageChangedPayload>) => {
      const { contractTransaction, stage } = action.payload;
      const game = state[contractTransaction];

      if (stage <= game.stage) return state;

      game.stage = action.payload.stage;
      game.turnOf = game.stage === Stage.TIMEOUT_CLAIM_SENT ? game.turnOf : turnByStage[game.stage] || null;
      game.updatedAt = new Date().toISOString();

      return state;
    },
    p2WeaponChanged: (state, action: PayloadAction<P2WeaponChangedPayload>) => {
      const { contractTransaction, weapon } = action.payload;
      state[contractTransaction].p2Weapon = weapon;
      return state;
    },
    gameCreated: (state, action: PayloadAction<GameCreatedPayload>) => {
      state[action.payload.contractTransaction] = {
        ...action.payload,
        stage: Stage.CONTRACT_SENT,
        player: Player.P1,
        turnOf: null,
        stake: action.payload.stake,
        updatedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
      };
      return state;
    },
    gameJoined: (state, action: PayloadAction<GameJoinedPayload>) => {
      state[action.payload.contractTransaction] = {
        ...action.payload,
        stake: action.payload.stake,
        stage: Stage.CONTRACT_SENT,
        turnOf: null,
        updatedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
      };
      return state;
    },
    contractDeployed: (state, action: PayloadAction<ContractDeployedPayload>) => {
      const game = state[action.payload.contractTransaction];
      game.contractAddress = action.payload.contractAddress;
      return state;
    },
    gameFinished: (state, action: PayloadAction<GameFinishedPayload>) => {
      const { contractTransaction, result, nonce, p1Weapon } = action.payload;
      const game = state[contractTransaction];
      game.stage = Stage.FINISHED;
      game.result = result;
      if (p1Weapon) game.p1Weapon = p1Weapon;
      if (nonce) game.nonce = nonce;
      game.turnOf = null;
      game.updatedAt = new Date().toISOString();
      return state;
    },
    gameDeleted: (state, action: PayloadAction<ContractTransactionPayload>) => {
      delete state[action.payload.contractTransaction];
      return state;
    },
  },
});

export const {
  contractVariablesRead,
  stageChanged,
  p2WeaponChanged,
  gameCreated,
  gameJoined,
  contractDeployed,
  gameFinished,
  gameDeleted,
} = gamesSlice.actions;
