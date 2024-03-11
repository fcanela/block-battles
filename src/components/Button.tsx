import clsx from 'clsx';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'normal' | 'primary';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  size = 'md',
  variant = 'normal',
  className,
  disabled = false,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded mx-2 my-2',
        size === 'sm' && 'px-6 py-2 text-xs',
        size === 'md' && 'px-8 py-3 text-sm',
        size === 'lg' && 'px-10 py-4 text-sm',
        variant === 'normal' &&
          !disabled &&
          'bg-white hover:border-indigo-600 hover:text-indigo-600 border border-indigo-700',
        variant === 'primary' && !disabled && 'bg-indigo-700 hover:bg-indigo-600 text-white',
        disabled && 'bg-gray-300 text-gray-400 cursor-not-allowed',
        !disabled && 'transition duration-150 ease-in-out cursor-pointer',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
