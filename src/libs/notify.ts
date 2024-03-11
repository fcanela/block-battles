import { toast } from 'react-toastify';
import type { Hash } from 'viem';

export enum Events {
  GAME_START,
  GAME_JOINED,
  GAME_END,
  GAME_DELETED,
  GENERIC_ERROR,
  NOT_A_PLAYER_ERROR,
  UNAUTHORIZED_ACTION_ERROR,
  INCORRECT_TURN_ERROR,
  GAME_NOT_FOUND_ERROR,
  UNEXPECTED_CONTRACT_ERROR,
}

const INFORMATIVE_EVENTS = [Events.GAME_START, Events.GAME_JOINED, Events.GAME_END];

type NotificationTexts = {
  [key in Events]: string;
};

const texts: NotificationTexts = {
  [Events.GAME_START]: 'Game started!',
  [Events.GAME_JOINED]: 'You joined the game',
  [Events.GAME_END]: 'Game finished!',
  [Events.GAME_DELETED]: 'Game sucessfully deleted',
  [Events.GENERIC_ERROR]: 'Something went wrong',
  [Events.NOT_A_PLAYER_ERROR]: 'You are not a player in this game',
  [Events.UNAUTHORIZED_ACTION_ERROR]: 'You are not the player who should perform this action',
  [Events.INCORRECT_TURN_ERROR]: 'This is not the correct turn for this action',
  [Events.GAME_NOT_FOUND_ERROR]: 'Unable to find the game',
  [Events.UNEXPECTED_CONTRACT_ERROR]: 'Unexpected contract. This may be a fraud attempt.',
};

/**
 * Shows an informational toast containing the preconfigured text for the provided event name
 *
 * @param {Events} eventName - The event to be displayed
 * @param {Hash} contractTransaction - The hash of the transaction that created the contract
 *
 * @example
 * notify(Events.GAME_START, '0x...');
 */

export const notify = (eventName: Events, contractTransaction: Hash) => {
  const isError = !INFORMATIVE_EVENTS.includes(eventName);

  const shortTx = contractTransaction.substring(0, 8);
  const text = `Game ${shortTx}: ${texts[eventName]}`;
  const showToast = isError ? toast.error : toast.success;
  const log = isError ? console.error : console.log;

  showToast(text, {
    autoClose: eventName === Events.UNEXPECTED_CONTRACT_ERROR ? false : 10_000,
  });
  log(text);
};
