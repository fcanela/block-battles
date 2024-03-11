import { NavLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  icon: React.ReactNode;
  to: string;
};

export default function NavBarMenuEntry({ children, icon: Icon, to }: Props) {
  return (
    <NavLink to={to}>
      <li className="cursor-pointer flex items-center text-sm hover:text-gray-300 tracking-normal mx-3">
        <span className="mr-2">{Icon}</span>
        {children}
      </li>
    </NavLink>
  );
}
