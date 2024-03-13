import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import type { Hash } from 'viem';
import { z } from 'zod';
import Button from '../components/Button';
import useConnectable from '../hooks/useConnectable';
import { useJoinGame } from '../hooks/useJoinGame';
import Field from '../components/Field';

const ethereumTransactionRegex = /^0x[a-fA-F0-9]{64}$/;

const joinGameFormSchema = z.object({
  contractTransaction: z.string().regex(ethereumTransactionRegex, 'Invalid Ethereum transaction'),
});

type JoinGameForm = z.infer<typeof joinGameFormSchema>;

export default function JoinGamePage() {
  const { contractTransaction: urlContractTransaction } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contractTransaction: urlContractTransaction,
    },
    resolver: zodResolver(joinGameFormSchema),
  });
  const joinGame = useJoinGame();
  const navigate = useNavigate();
  const connectable = useConnectable();

  const onSubmit: SubmitHandler<JoinGameForm> = async fields => {
    await joinGame(fields.contractTransaction as Hash);
    navigate(`/games/${fields.contractTransaction}`);
  };

  return (
    <article className="flex flex-col w-full items-center justify-center max-w-screen-md gap-16">
      <form
        onSubmit={handleSubmit(connectable(onSubmit))}
        className="flex flex-col items-center justify-center w-full gap-4"
      >
        <Field
          label="ID (or transaction hash of the contract creation)"
          errors={errors.contractTransaction}
          className="w-full"
        >
          <input
            className="w-full p-4 outline-indigo-700 font-mono"
            minLength={66}
            maxLength={66}
            type="text"
            {...register('contractTransaction')}
          />
        </Field>
        <Button type="submit" variant="primary">
          Join
        </Button>
      </form>
      <div className="text-center text-sm">
        Ask your opponent to provide you the join game URL or the transaction hash that created the game contract.
      </div>
    </article>
  );
}
