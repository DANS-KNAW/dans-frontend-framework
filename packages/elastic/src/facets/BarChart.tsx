import FacetContainer from "../ui-components/FacetContainer";
import { type FacetViewProps } from "@elastic/react-search-ui-views";

const BarChartFacet: React.FC<FacetViewProps> = ({ 
  label, 
  // onMoreClick, 
  // onRemove, 
  // onSelect, 
  // options 
}) => {
  return (
    <FacetContainer label={label}>
      
    </FacetContainer>
  );
};

export default BarChartFacet;