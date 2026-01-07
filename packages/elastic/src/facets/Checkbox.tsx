import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FacetContainer from "../ui-components/FacetContainer";
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { useState, useEffect } from "react";

const CheckboxFacet: React.FC<FacetViewProps> = ({ 
  label, 
  onMoreClick, 
  showMore,
  onRemove, 
  onSelect, 
  options,
  showSearch,
  onSearch,
  ...restProps
}) => {
  console.log(restProps)

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  return (
    <FacetContainer label={label}>
      {showSearch && options.length > 4 && <TextField
        size="small"
        placeholder={`Filter ${label}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      /> }
      <FormGroup>
        {options.length < 1 && <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>No options found</Typography>}
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            sx={{ 
              '.MuiFormControlLabel-label': { fontSize: '0.875rem' },
              mb: 1,
            }}
            control={
              <Checkbox
                size="small"
                checked={option.selected}
                sx={{ pt: 0, pb: 0 }}
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
      {showMore && (
        <Button size="small" onClick={onMoreClick}>
          Show more
        </Button>
      )}
    </FacetContainer>
  );
};

export default CheckboxFacet;