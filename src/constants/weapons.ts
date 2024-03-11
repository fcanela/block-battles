import {
  GiRock as RockIcon,
  GiPaper as PaperIcon,
  GiScissors as ScissorsIcon,
  GiHandOk as LizardIcon,
  GiSpockHand as SpockIcon,
} from 'react-icons/gi';
import { FaQuestion as UnknownIcon } from 'react-icons/fa6';

export enum Weapon {
  NULL,
  ROCK,
  PAPER,
  SCISSORS,
  SPOCK,
  LIZARD,
}

export const unknownWeapon = {
  text: '????',
  icon: UnknownIcon,
};

export const weaponDetails = {
  [Weapon.NULL]: unknownWeapon,
  [Weapon.ROCK]: {
    text: 'Rock',
    icon: RockIcon,
  },
  [Weapon.PAPER]: {
    text: 'Paper',
    icon: PaperIcon,
  },
  [Weapon.SCISSORS]: {
    text: 'Scissors',
    icon: ScissorsIcon,
  },
  [Weapon.LIZARD]: {
    text: 'Lizard',
    icon: LizardIcon,
  },
  [Weapon.SPOCK]: {
    text: 'Spock',
    icon: SpockIcon,
  },
};
