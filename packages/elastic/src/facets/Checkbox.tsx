import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Button from "@mui/material/Button";
import FacetContainer from "../ui-components/FacetContainer";
import { type FacetViewProps } from "@elastic/react-search-ui-views";

const CheckboxFacet: React.FC<FacetViewProps> = ({ 
  label, 
  onMoreClick, 
  onRemove, 
  onSelect, 
  options 
}) => {
  return (
    <FacetContainer label={label}>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={option.selected}
                onChange={() =>
                  option.selected
                    ? onRemove(option.value)
                    : onSelect(option.value)
                }
              />
            }
            label={`${option.value} (${option.count})`}
          />
        ))}
      </FormGroup>
      {onMoreClick && (
        <Button size="small" onClick={onMoreClick}>
          Show more
        </Button>
      )}
    </FacetContainer>
  );
};

export default CheckboxFacet;