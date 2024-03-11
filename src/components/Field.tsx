import clsx from 'clsx';
import { FieldError } from 'react-hook-form';

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
  errors?: FieldError;
};

export default function Field({ label, children, className, errors }: Props) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label className="mb-2 font-bold text-indigo-700">{label}</label>
      {children}
      {errors && (
        <div className="flex items-center justify-between mt-2 text-red-700">
          <p className="text-xs leading-3 tracking-normal">{errors.message}</p>
        </div>
      )}
    </div>
  );
}
