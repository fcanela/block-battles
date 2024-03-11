import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';

type FaqItemProps = {
  title: string;
  children: React.ReactNode;
};
export default function FAQItem({ title, children }: FaqItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = isExpanded ? FaMinus : FaPlus;

  return (
    <section className="flex flex-col mb-7">
      <div className="flex flex-row items-baseline cursor-pointer mb-2" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="pr-4">
          <Icon />
        </div>
        <h3 className="font-bold font-xl">{title}</h3>
      </div>
      <div>{isExpanded && children}</div>
    </section>
  );
}
