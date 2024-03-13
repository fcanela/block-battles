import { FaArrowUpRightFromSquare as ExternalIcon } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Hash } from 'viem';

type Props = {
  type?: 'address' | 'tx';
  value?: string | Hash;
};

export default function EtherscanLink({ value, type = 'address' }: Props) {
  if (!value) return <span className="font-mono">Unknown</span>;

  const url = `https://sepolia.etherscan.io/${type}/${value}`;

  return (
    <Link className="font-mono flex flex-row" target="_blank" to={url}>
      {value.substring(0, 8)}... <ExternalIcon />
    </Link>
  );
}
