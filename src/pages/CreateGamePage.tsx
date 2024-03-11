import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import Button from '../components/Button';
import SelectWeapon from '../components/SelectWeapon';
import { Weapon } from '../constants/weapons';
import useConnectable from '../hooks/useConnectable';
import { useCreateGame } from '../hooks/useCreateGame';
import Field from '../components/Field';

const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export default function CreateGamePage() {
  const { address: myAddress } = useAccount();

  const createGameFormSchema = z.object({
    p2: z
      .string()
      .regex(ethereumAddressRegex, 'Invalid Ethereum address')
      .regex(new RegExp(`(?!^${myAddress}$)`), 'Playing with yourself may be good, but playing with others is better'),
    stake: z.coerce.number().positive(),
    p1Weapon: z.nativeEnum(Weapon),
  });

  type CreateGameForm = z.infer<typeof createGameFormSchema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CreateGameForm>({
    resolver: zodResolver(createGameFormSchema),
  });
  const createGame = useCreateGame();
  const navigate = useNavigate();
  const connectable = useConnectable();

  const onSubmit: SubmitHandler<CreateGameForm> = async fields => {
    // @ts-expect-error: the player address is not detected as a string starting by 0x, but as a generic string
    const hash = await createGame(fields);
    navigate(`/games/${hash}`);
  };

  return (
    <div className="flex items-center w-full flex-col justify-center h-full">
      <form onSubmit={handleSubmit(connectable(onSubmit))} className="flex flex-col">
        <div className="flex gap-2">
          <Field className="w-3/4" label="Opponent" errors={errors.p2}>
            <input type="text" {...register('p2')} />
          </Field>

          <Field className="w-1/4" label="Stake in ETH" errors={errors.stake}>
            <input type="number" min={0.001} step={0.001} {...register('stake')} />
          </Field>
        </div>
        <Field className="flex flex-col my-4" label="Weapon" errors={errors.p1Weapon}>
          <Controller
            name="p1Weapon"
            control={control}
            render={({ field: { onChange, value } }) => <SelectWeapon onChange={onChange} value={value} />}
          />
        </Field>
        <div className="flex justify-center my-8">
          <Button type="submit" variant="primary">
            Create a new game
          </Button>
        </div>
      </form>
    </div>
  );
}
