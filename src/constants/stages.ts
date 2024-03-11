export const enum Stage {
  CONTRACT_SENT,
  STARTED,
  P2_MOVED_SENT,
  P2_MOVED,
  P1_REVEALED_SENT,
  WAITING_RESULT,
  TIMEOUT_CLAIM_SENT,
  FINISHED,
}

type StageTexts = {
  [stage in Stage]: [string, string];
};

export const stageTexts: StageTexts = {
  [Stage.CONTRACT_SENT]: ['Initializing', 'The contract was sent but not mined yet'],
  [Stage.STARTED]: ['P2 turn', 'Player 2 has to send a movement'],
  [Stage.P2_MOVED_SENT]: [
    'Processing move',
    'You sent your move, but it has still not been processed by the blockchain',
  ],
  [Stage.P2_MOVED]: ['P1 reveal turn', 'Player 2 moved. Time to Player 1 to reveal the move'],
  [Stage.P1_REVEALED_SENT]: [
    'Reveal being processed',
    'You completed the game by revealing your move, but it has still not been processed by the blockchain',
  ],
  [Stage.TIMEOUT_CLAIM_SENT]: [
    'Timeout claim sent',
    'You completed the game by claiming a timeout, but it has still not been processed by the blockchain',
  ],
  [Stage.WAITING_RESULT]: ['Waiting result', 'Game finished, winner will appear soon'],
  [Stage.FINISHED]: ['Finished', 'Game finished. Rewards have been distributed'],
};
