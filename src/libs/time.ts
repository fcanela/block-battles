import { addMinutes, formatDistanceToNowStrict, isPast } from 'date-fns';
import { GameState } from '../store/gamesSlice';
import { Stage } from '../constants/stages';

/**
 * This function converts Soldity epoch timestamps (seconds from epoch, bigint)
 * to Javascript date.
 *
 * @param {bigint} The number os seconds since epoch
 *
 * @return {Date} The JavaScript date
 */
export const parseSolidityDate = (date: bigint) => new Date(Number(date) * 1_000);

export type TimeoutState = {
  isLate: boolean;
  isAlmostLate: boolean;
  distance: string;
};

const stagesWithTimeout = [Stage.STARTED, Stage.P2_MOVED];

/**
 * Provides contextual information regarding the timeout of an action. More precisely
 * it indicates:
 * 1. If the user is already late, so timeouts can be claimed
 * 2. If the user is getting close to be late and their transaction may not get mined on time,
 * potentially resulting in lost funds.
 * 3. A human friendly description of the distance to the timeout
 *
 * @param {GameState} game - The state of the game, to obtain the stage and last action
 *
 * @returns {TimeoutState} Contextual information about the timeout state
 *
 */
export const getGameTimeoutState = (game: GameState): TimeoutState => {
  const result = {
    isLate: false,
    isAlmostLate: false,
    distance: '',
  };

  if (!stagesWithTimeout.includes(game.stage) || !game.lastAction) return result;
  const lastAction = new Date(game.lastAction);

  const lateAt = addMinutes(lastAction, 5);
  result.isLate = isPast(lateAt);

  const distance = formatDistanceToNowStrict(lateAt);
  result.distance = result.isLate ? `${distance} ago` : `in ${distance}`;

  const almostLateAt = addMinutes(lastAction, 4);
  result.isAlmostLate = isPast(almostLateAt);

  return result;
};
