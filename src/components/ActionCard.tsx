import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};
export default function ActionCard({ children, size = 'md', className }: Props) {
  return (
    <div
      className={clsx(
        'border border-indigo-200 p-2',
        size === 'sm' && 'w-1/4',
        size === 'md' && 'w-2/4',
        size === 'lg' && 'w-3/4',
        className,
      )}
    >
      {children}
    </div>
  );
}
