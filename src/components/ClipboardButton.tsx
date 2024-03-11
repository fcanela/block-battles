import { useState } from 'react';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa6';

type Props = {
  value: string;
};

export default function ClipboardButton({ value }: Props) {
  const [isCopied, setCopied] = useState(false);

  const onClick = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  const Icon = isCopied ? FaClipboardCheck : FaClipboard;

  return (
    <button onClick={onClick}>
      <Icon />
    </button>
  );
}
