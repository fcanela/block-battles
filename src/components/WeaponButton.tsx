import clsx from 'clsx';
import { Weapon, weaponDetails } from '../constants/weapons';

type Props = {
  weapon: Weapon;
  selected: boolean;
  onClick?: (weapon: Weapon) => void;
};

export default function WeaponButton({ weapon, selected, onClick }: Props) {
  const { text, icon: Icon } = weaponDetails[weapon];

  return (
    <button
      className={clsx(
        'flex flex-col w-20 py-2 items-center border justify-center',
        selected && 'bg-indigo-700 text-white',
        !selected && 'border-gray-500',
      )}
      type="button"
      onClick={() => onClick && onClick(weapon)}
    >
      <Icon size="24" />
      <span>{text}</span>
    </button>
  );
}
