import { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import { useAuth } from "react-oidc-context";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function UserSettings() {
  return (
    <Container sx={{ mt: 6 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid xs={12} md={6} lg={4}>
          <UserInfo />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <UserRoles />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <UserContext />
        </Grid>
      </Grid>
    </Container>
  );
}

function UserInfo() {
  const auth = useAuth();
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={2}>
          My identity
        </Typography>
        <TextField label="First name" value={auth.user?.profile.given_name || "N/A"} disabled size="small" sx={{ mb: 2 }} fullWidth />
        <TextField label="Last name" value={auth.user?.profile.family_name || "N/A"} disabled size="small" sx={{ mb: 2 }} fullWidth />
        <TextField label="Email" value={auth.user?.profile.email || "N/A"} disabled size="small" fullWidth />
      </CardContent>
    </Card>
  )
}

function UserRoles() {
  const fixedOptions = [tempRoles[0]];
  const [value, setValue] = useState([...fixedOptions]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          My role(s)
        </Typography>
        <Typography variant="body2" mb={3}>
          Select one or more roles that apply to you. These roles will be used to determine your access and permissions within the FAIR assessment system.
        </Typography>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={tempRoles}
          getOptionLabel={(option) => option.label}
          value={value}
          onChange={(_event, newValue) => {
            setValue([
              ...fixedOptions,
              ...newValue.filter((option) => !fixedOptions.includes(option)),
            ]);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Roles"
              placeholder="Select roles"
            />
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.label}
                  {...tagProps}
                  disabled={fixedOptions.indexOf(option) !== -1}
                />
              );
            })
          }
        />
      </CardContent>
    </Card>
  )
}

const tempRoles = [
  { label: "Depositor", value: "depositor" },
  { label: "Manager", value: "manager" },
  { label: "Curator", value: "curator" },
  { label: "Institution", value: "institution" },
]

function UserContext() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          My context
        </Typography>
        <Typography variant="body2" mb={3}>
          Set the context for each of your roles.
        </Typography>
      </CardContent>
    </Card>
  )
}