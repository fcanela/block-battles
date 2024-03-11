import { Weapon } from '../constants/weapons';
import WeaponButton from './WeaponButton';

type Props = {
  onChange?: (weapon: Weapon) => void;
  value?: Weapon | null;
};
export default function SelectWeapon({ onChange, value }: Props) {
  return (
    <div className="flex flex-row justify-between gap-2">
      <WeaponButton weapon={Weapon.ROCK} selected={value === Weapon.ROCK} onClick={onChange} />
      <WeaponButton weapon={Weapon.PAPER} selected={value === Weapon.PAPER} onClick={onChange} />
      <WeaponButton weapon={Weapon.SCISSORS} selected={value === Weapon.SCISSORS} onClick={onChange} />
      <WeaponButton weapon={Weapon.LIZARD} selected={value === Weapon.LIZARD} onClick={onChange} />
      <WeaponButton weapon={Weapon.SPOCK} selected={value === Weapon.SPOCK} onClick={onChange} />
    </div>
  );
}
