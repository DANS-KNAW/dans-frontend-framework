import { useState, type SyntheticEvent, type ReactNode, useEffect, useMemo, type SetStateAction, type Dispatch } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import { useAuth } from "react-oidc-context";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useQuery } from "@tanstack/react-query";
import { fetchPid, fetchRepositories, fetchRepositoryDetails, type Pid, type Obj } from "./api";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

const tempRoles = [
  { label: "Depositor", value: "depositor" },
  { label: "Curator", value: "curator" },
  { label: "Manager", value: "manager" },
];

const tabs = [{
  label: "My objects",
  value: ["depositor", "manager", "curator"],
  id: 'objects',
}, {
  label: "My repositories",
  value: ["manager", "curator"],
  id: 'repositories',
}, {
  label: "My institutions",
  value: ["manager"],
  id: 'institutions',
}];

const fixedOptions = [tempRoles[0]];

export default function UserSettings() {
  const [roles, setRoles] = useState([...fixedOptions]);
  const [objects, setObjects] = useState<Pid[]>([]);
  const [repositories, setRepositories] = useState<Obj[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const activeTabs = useMemo(() => {
    return tabs.filter(tab =>
      tab.value.some(role =>
        roles.map(v => v.value).includes(role)
      )
    );
  }, [roles]);

  useEffect(() => {
  if (tabValue >= activeTabs.length) {
    setTabValue(0);
  }
}, [activeTabs.length, tabValue]);

  return (
    <Container sx={{ mt: 6 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <UserInfo />
        </Grid>
        <Grid xs={12} md={6}>
          <UserRoles value={roles} setValue={setRoles} />
        </Grid>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={handleChange} aria-label="Set user context">
                {activeTabs.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
                ))}
              </Tabs>
              {activeTabs.map((tab, index) =>
                <TabPanel value={tabValue} index={index} key={index}>
                  {tab.id === 'objects' && <Objects objects={objects} setObjects={setObjects} />}
                  {tab.id === 'repositories' && <Repositories repositories={repositories} setRepositories={setRepositories} />}
                  {tab.id === 'institutions' && <Institutions />}
                </TabPanel>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function TabPanel({ children, value, index }: { children: ReactNode, value: number, index: number }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
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
        <TextField label="First name" value={auth.user?.profile.given_name || "N/A"} disabled sx={{ mb: 2 }} fullWidth />
        <TextField label="Last name" value={auth.user?.profile.family_name || "N/A"} disabled sx={{ mb: 2 }} fullWidth />
        <TextField label="Email" value={auth.user?.profile.email || "N/A"} disabled fullWidth />
      </CardContent>
    </Card>
  )
}

function UserRoles({value, setValue}: { value: { label: string, value: string }[], setValue: (value: { label: string, value: string }[]) => void }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={1}>
          My role(s)
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <FormHelperText>Select one or more roles that apply to you. These roles will be used to determine your access and permissions within the FAIR assessment system.</FormHelperText>
          <FormGroup>
            {tempRoles.map((role) => {
              const isFixed = fixedOptions.some((opt) => opt.value === role.value);
              const isSelected = value.some((opt) => opt.value === role.value);
              return (
                <FormControlLabel
                  key={role.value}
                  control={
                    <Switch
                      checked={isSelected}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        let newValue;
                        if (checked) {
                          newValue = [...value, role];
                        } else {
                          newValue = value.filter((v) => v.value !== role.value);
                        }
                        // Ensure fixed options are always included
                        const withFixed = [
                          ...fixedOptions,
                          ...newValue.filter(
                            (option) => !fixedOptions.some((f) => f.value === option.value)
                          ),
                        ];
                        setValue(withFixed);
                      }}
                      disabled={isFixed}
                    />
                  }
                  label={role.label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  )
}

function Objects({ objects, setObjects }: { objects: Pid[], setObjects: Dispatch<SetStateAction<Pid[]>> }) {
  const [ activeId, setActiveId ] = useState<string>("");
  const [ id, setId ] = useState<string>("");
  const { data } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          Add new PID
        </Typography>
        <Typography variant="body2" mb={1}>
          Enter a PID for one of your datasets to look up the corresponding repository and collections.
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField label="PID" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
          <Button variant="contained" onClick={() => setId(activeId)}>Find</Button>
        </Stack>
        {data?.dataset && activeId === id && activeId && (
          <Alert severity="info" sx={{ mt: 1, '.MuiAlert-message': { flex: 1 } }}>
            <AlertTitle>Dataset found</AlertTitle>
            <Box>
              <Typography variant="body2">
                Dataset: {data.dataset.name}
              </Typography>
              <Typography variant="body2">
                Repository: {data.repository.name}
              </Typography>
              <Typography variant="body2">
                Collections: {data.collections.map(c => c.name).join(', ')}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 1, float: 'right' }} 
                onClick={() => {
                  setActiveId("");
                  setId("");
                  setObjects([...objects, data])
                }}
              >
                Add to selected PIDs
              </Button>
            </Box>
          </Alert>
        )}
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6">
          Currently selected PIDs
        </Typography>
        <List dense>
          {objects.length > 0 ? objects.map((obj, index) => 
            <ListItem
              disableGutters
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => {
                  setObjects(objects.filter((_, i) => i !== index));
                }}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton component="a" href={obj.dataset.url} target="_blank">
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={obj.dataset.name}
                  secondary={`${obj.repository.name} / DOI ${obj.dataset.id}`}
                />
              </ListItemButton>
            </ListItem>,
          ) :
            <ListItem key="empty" disableGutters>
              <ListItemText primary="No PIDs selected" />
            </ListItem>
          }
        </List>
      </Grid>
    </Grid>
  );
}

function Repositories({ repositories, setRepositories }: { repositories: Obj[], setRepositories: Dispatch<SetStateAction<Obj[]>> }) {
  const [ repo, setRepo ] = useState<Obj>();
  const { data, isLoading } = useQuery({ queryKey: ['repositories'], queryFn: () => fetchRepositories() });
  const { data: dataDetails, } = useQuery({ queryKey: ['repositoryDetails', repo?.id], queryFn: () => fetchRepositoryDetails(repo!.id), enabled: !!repo?.id });

  console.log(data)
  console.log(dataDetails)
  console.log(repositories)

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Typography variant="h6" mb={1}>
          Add repository
        </Typography>
        <Autocomplete
          options={data || []}
          renderInput={(params) => <TextField {...params} label="Search for repository"/>}
          loading={isLoading}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={repo}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          onChange={(_event, newValue) => newValue && setRepo(newValue) }
        />
        {repo && dataDetails && (
          <Alert severity="info" sx={{ mt: 1, '.MuiAlert-message': { flex: 1 } }}>
            <AlertTitle>Repository info</AlertTitle>
            <Box>
              <Typography variant="body2">
                Name: {dataDetails.name}
              </Typography>
              <Typography variant="body2">
                Institutions: {dataDetails.institutions.map(inst => inst.name).join(', ')}
              </Typography>
              <Typography variant="body2">
                URL: <Link href={dataDetails.url} target="_blank">{dataDetails.url}</Link>
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 1, float: 'right' }} 
                onClick={() => setRepositories([...repositories, {...repo, url: dataDetails.url}])}
              >
                Add to selected repositories
              </Button>
            </Box>
          </Alert>
        )}
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6">
          Currently selected repositories
        </Typography>
        <List dense>
          {repositories.length > 0 ? repositories.map((repo, index) => 
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => {
                  setRepositories(repositories.filter((_, i) => i !== index));
                }}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton component="a" href={repo.url} target="_blank">
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={repo.name}
                  secondary={`${repo.id}`}
                />
              </ListItemButton>
            </ListItem>,
          ) :
            <ListItem key="empty" disableGutters>
              <ListItemText primary="No repositories selected" />
            </ListItem>
          }
        </List>
      </Grid>
    </Grid>
  );
}

function Institutions() {
  const [ activeId, setActiveId ] = useState<string>("");
  const [ id, setId ] = useState<string>("");
  const { data } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });

  return (
    <Box>
      <Typography variant="body2" mb={1}>
        Provide an institution you manage.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }} >
        <TextField label="Search for insitution" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
        {data && <Button variant="contained" onClick={() => setId(activeId)}>Add</Button>}
      </Stack>
    </Box>
  );
}
