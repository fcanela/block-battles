export enum GameResult {
  P1_WINS,
  P2_WINS,
  DRAW,
  // Unexpected bytecode, source code, etc
  INVALID,
}

type ResultTexts = {
  [key in GameResult]: string;
};

export const gameResultTexts: ResultTexts = {
  [GameResult.P1_WINS]: 'Player1 wins!',
  [GameResult.P2_WINS]: 'Player2 wins!',
  [GameResult.DRAW]: 'Draw',
  [GameResult.INVALID]: 'Invalid contract',
};
