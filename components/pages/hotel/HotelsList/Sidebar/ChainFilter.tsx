"use client";

import Checkbox from "@/components/shared/form/Checkbox";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useTranslations } from "next-intl";

type ChainType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  chains: ChainType[];
};

const ChainFilter = (props: Props) => {
  const t = useTranslations("HotelsList.Filters");
  const { chains } = props;
  const { selectedChains, toggleChain } = useHotelFilterRedux();
  const [showAll, setShowAll] = useState(false);

  const initialVisibleCount = 8;
  const visibleChains = showAll
    ? chains
    : chains?.slice(0, initialVisibleCount);

  return (
    <div className="flex flex-col gap-2">
      {visibleChains?.map((chain) => {
        const isSelected = selectedChains.includes(chain.id);
        return (
          <Checkbox
            key={chain.id}
            name={chain.id}
            checked={isSelected}
            onChange={() => toggleChain(chain.id)}
            label={chain.text}
            count={chain.count}
          />
        );
      })}

      {chains?.length > initialVisibleCount && (
        <button
          className="flex items-center gap-2 text-primary font-medium mt-2 hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          <span>{showAll ? t("showLess") : t("showMore")}</span>
          {showAll ? (
            <FiChevronUp className="ml-1" />
          ) : (
            <FiChevronDown className="ml-1" />
          )}
        </button>
      )}
    </div>
  );
};

export default ChainFilter;
