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
import { useQuery } from "@tanstack/react-query";
import { fetchPid } from "./api";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const tempRoles = [
  { label: "Depositor", value: "depositor" },
  { label: "Manager", value: "manager" },
  { label: "Curator", value: "curator" },
  { label: "Institution", value: "institution" },
]

const fixedOptions = [tempRoles[0]];

export default function UserSettings() {
  const [roles, setRoles] = useState([...fixedOptions]);
  const [context, setContext] = useState("");

  return (
    <Container sx={{ mt: 6 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={4}>
          <UserInfo />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <UserRoles value={roles} setValue={setRoles} />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <UserContext value={context} setValue={setContext} roles={roles} />
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

function UserRoles({value, setValue}: { value: { label: string, value: string }[], setValue: (value: { label: string, value: string }[]) => void }) {
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

function UserContext({ value, setValue, roles }: { value: string, setValue: (value: string) => void, roles: { label: string, value: string }[] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          My context
        </Typography>
        <Typography variant="body2" mb={3}>
          Set the context for each of your roles.
        </Typography>
        {roles.map((role, index) => (
          role.value === "depositor" ? 
          <DepositorRole key={role.value} role={role} last={index === roles.length - 1} /> :
          role.value === "manager" ? 
          <ManagerRole key={role.value} role={role} last={index === roles.length - 1} /> :
          role.value === "curator" ? 
          <CuratorRole key={role.value} role={role} last={index === roles.length - 1} /> :
          null
        ))}
      </CardContent>
    </Card>
  )
}

function DepositorRole({ role, last }: { role: { label: string, value: string }; last: boolean }) {
  const [ activeId, setActiveId ] = useState("");
  const [ id, setId ] = useState("");
  const { data } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });

  return (
    <Box mb={!last ? 2 : 0}>
      <Typography variant="h6" gutterBottom>
        {role.label}
      </Typography>
      <Typography variant="body2" mb={1}>
        Enter a PID for one of your datasets to look up the corresponding repository and collections.
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField key={role.value} label="PID" size="small" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
        <Button variant="contained" size="small" onClick={() => setId(activeId)}>Go</Button>
      </Stack>
      {data && (
        <Box mt={1}>
          <Typography variant="body2">
            Dataset: {data.dataset.name}
          </Typography>
          <Typography variant="body2">
            Repository: {data.repository.name}
          </Typography>
          <Typography variant="body2">
            Collections: {data.collections.map(c => c.name).join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}


function ManagerRole({ role, last }: { role: { label: string, value: string }; last: boolean }) {
  const [ activeId, setActiveId ] = useState("");
  const [ id, setId ] = useState("");
  const { data } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });

  return (
    <Box mb={!last ? 2 : 0}>
      <Typography variant="h6" gutterBottom>
        {role.label}
      </Typography>
      <Typography variant="body2" mb={1}>
        Provide an institution you manage.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }} >
        <TextField key={role.value} label="Search for insitution" size="small" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
        {data && <Button variant="contained" size="small" onClick={() => setId(activeId)}>Add</Button>}
      </Stack>
    </Box>
  );
}

function CuratorRole({ role, last }: { role: { label: string, value: string }; last: boolean }) {
  const [ activeId, setActiveId ] = useState("");
  const [ id, setId ] = useState("");
  const { data } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });

  return (
    <Box mb={!last ? 2 : 0}>
      <Typography variant="h6" gutterBottom>
        {role.label}
      </Typography>
      <Typography variant="body2" mb={1}>
        Provide an institution you manage.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }} >
        <TextField key={role.value} label="Search for insitution" size="small" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
        {data && <Button variant="contained" size="small" onClick={() => setId(activeId)}>Add</Button>}
      </Stack>
    </Box>
  );
}