import { useState, type SyntheticEvent, type ReactNode, useEffect, useMemo, type SetStateAction, type Dispatch, forwardRef } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import { useAuth } from "react-oidc-context";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useQuery } from "@tanstack/react-query";
import { fetchPid, fetchRepositories, fetchRepositoryDetails, fetchRor, type Pid, type Obj, type RorResponse } from "./api";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem, { type ListItemProps } from '@mui/material/ListItem';
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useDebounce } from "use-debounce";
import DatasetIcon from '@mui/icons-material/Dataset';
import { LayoutGroup, motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";

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
  const [institutions, setInstitutions] = useState<any[]>([]);
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
                  {tab.id === 'institutions' && <Institutions selectedRepositories={repositories} institutions={institutions} setInstitutions={setInstitutions} />}
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
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h5" mb={1}>
          My role(s)
        </Typography>
        <Typography variant="body2" mb={1}>
          Select one or more roles that apply to you. These roles will be used to determine your access and permissions within the FAIR assessment system.
        </Typography>
        <FormControl component="fieldset" variant="standard">
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
  const isSelected = data && objects.some(r => r.id === data.id)

  return (
    <Grid container spacing={6}>
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
        {data && activeId === id && activeId && (
          <Alert severity="info" sx={{ mt: 1, '.MuiAlert-message': { flex: 1 } }}>
            <AlertTitle>Dataset found</AlertTitle>
            <Box>
              <Typography variant="body2">
                Dataset: {data.name}
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
                disabled={isSelected}
                onClick={() => {
                  setActiveId("");
                  setId("");
                  setObjects([...objects, data])
                }}
              >
                {!isSelected ? "Add to selected PIDs" : "Selected"}
              </Button>
            </Box>
          </Alert>
        )}
      </Grid>
      <SelectedItems
        header="Selected PIDs"
        icon={<DatasetIcon />}
        items={objects}
        setItems={setObjects}
        emptyMessage="No PIDs selected"
        type="pid"
      />
    </Grid>
  );
}

function Repositories({ repositories, setRepositories }: { repositories: Obj[], setRepositories: Dispatch<SetStateAction<Obj[]>> }) {
  const [ repo, setRepo ] = useState<Obj>();
  const { data, isLoading } = useQuery({ queryKey: ['repositories'], queryFn: () => fetchRepositories() });
  const { data: dataDetails, } = useQuery({ queryKey: ['repositoryDetails', repo?.id], queryFn: () => fetchRepositoryDetails(repo!.id), enabled: !!repo?.id });
  const isSelected = dataDetails && repositories.some(r => r.id === dataDetails.id)

  return (
    <Grid container spacing={6}>
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
          value={repo || null}
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
                disabled={isSelected}
                onClick={() => {
                  setRepositories([...repositories, {...repo, url: dataDetails.url, institutions: dataDetails.institutions}])
                  setRepo(undefined);
                }}
              >
                {!isSelected ? "Add to selected repositories" : "Selected"}
              </Button>
            </Box>
          </Alert>
        )}
      </Grid>
      <SelectedItems
        header="Selected repositories"
        icon={<FolderIcon />}
        items={repositories}
        setItems={setRepositories}
        emptyMessage="No repositories selected"
      />
    </Grid>
  );
}

function Institutions({ selectedRepositories, institutions, setInstitutions }: { selectedRepositories?: Obj[], institutions: Obj[], setInstitutions: Dispatch<SetStateAction<Obj[]>> }) {
  const [ rorList, setRorList ] = useState<Obj[]>([]);
  const [ rorValue, setRorValue ] = useState<string>("");
  const debouncedRorValue = useDebounce(rorValue, 500)[0];
  const [ customRor, setCustomRor ] = useState<RorResponse>();
  const { data: rorData, isLoading } = useQuery({ queryKey: ['ror', debouncedRorValue], queryFn: () => fetchRor(debouncedRorValue), enabled: !!debouncedRorValue });

  useEffect(() => {
    const list = selectedRepositories?.map((repo) => (
      repo.institutions?.map((institution) => {
        const ror = institution.id.filter( id => id.type === "ROR" )[0];
        if (ror) {
          return {
            name: institution.name,
            id: ror.value,
          };
        }
        return null;
      }).filter((item): item is { name: string; id: string } => item !== null)
    )).flat();
    const uniqueByRor = Array.from(
      new Map(list?.map(item => [item?.id, item])).values()
    );
    const notSelectedRors = uniqueByRor.filter(item => !institutions.some(inst => inst.id === item?.id));
    Array.isArray(notSelectedRors) && setRorList(notSelectedRors as Obj[]);
  }, [selectedRepositories, institutions]);

  return (
    <LayoutGroup>
      <Grid container spacing={6}>
        <Grid xs={12} md={6}>
          <Typography variant="h6" mb={1}>
            Add institution
          </Typography>
          <Typography variant="body2" mb={1}>
            {selectedRepositories && selectedRepositories.length > 0 ? "Select an institution associated with one of your repositories" : "Please select a repository first to see associated institutions."}
          </Typography>
          {rorList.length > 0 && (
            <List dense>
              <AnimatePresence initial={false} mode="popLayout">
                {rorList.map((item) => (
                  <MotionListItem 
                    key={item.id} 
                    disableGutters 
                    layout 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                  >
                    <ListItemButton onClick={() => setInstitutions([...institutions, {...item, url: item.id?.replace("ROR:", "https://ror.org/") }])}>
                      <ListItemAvatar>
                        <Avatar>
                          <AccountBalanceIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.id}`}
                      />
                    </ListItemButton>
                  </MotionListItem>
                  ))}
              </AnimatePresence>
            </List>
          )}
          <Typography variant="body2" mb={1}>
            Or find your insitution in the RoR database
          </Typography>
          <Autocomplete
            options={rorData ?? []}
            renderInput={(params) => <TextField {...params} label="Search for institution"/>}
            loading={isLoading}
            getOptionLabel={(option) => option?.names?.map(name => name.value).join(" | ") || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={customRor}
            inputValue={rorValue}
            onInputChange={(_e, newValue) => {
              setRorValue(newValue);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option?.names?.map(name => name.value).join(" | ") || ""}
              </li>
            )}
            onChange={(_event, newValue) => {
              if (newValue) {
                !institutions.some(inst => inst.id === newValue.id) && setInstitutions([...institutions, {
                  name: newValue.names?.map(name => name.value).join(" | "),
                  url: newValue.id,
                  id: newValue.id.replace("https://ror.org/", "ROR:"),
                }]);
                setCustomRor(undefined);
              }
            }}
          />
        </Grid>
        <SelectedItems
          header="Selected institutions"
          icon={<AccountBalanceIcon />}
          items={institutions}
          setItems={setInstitutions}
          emptyMessage="No institutions selected"
        />
      </Grid>
    </LayoutGroup>
  );
}

type BaseProps = {
  header: string;
  icon: ReactNode;
  emptyMessage: string;
};

type PidProps = BaseProps & {
  type: "pid";
  items: Pid[];
  setItems: Dispatch<SetStateAction<Pid[]>>;
};

type ObjProps = BaseProps & {
  type?: undefined; // optional or undefined
  items: Obj[];
  setItems: Dispatch<SetStateAction<Obj[]>>;
};

type SelectedItemsProps = PidProps | ObjProps;

const rightListVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

function SelectedItems({
  header,
  icon,
  items,
  setItems,
  emptyMessage,
  type,
}: SelectedItemsProps) {
  return (
    <Grid xs={12} md={6}>
      <Typography variant="h6">
        {header}
      </Typography>
      <List dense>
        <AnimatePresence initial={false} mode="popLayout">
          {items.length > 0 ? items.map((item, index) => 
            <MotionListItem
              layout
              variants={rightListVariants}
              initial="initial" 
              animate="animate" 
              exit="exit"
              disableGutters
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => {
                  if (type === "pid") {
                    const typedItems = items as Pid[];
                    setItems(typedItems.filter((_, i) => i !== index));
                  } else {
                    const typedItems = items as Obj[];
                    setItems(typedItems.filter((_, i) => i !== index));
                  }
                }}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton component="a" href={item.url} target="_blank">
                <ListItemAvatar>
                  <Avatar>
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={type === "pid" ? `${item.repository?.name} / DOI ${item.id}` : item.id}
                />
              </ListItemButton>
            </MotionListItem>,
          ) :
            <MotionListItem key="empty" disableGutters variants={rightListVariants} initial="initial" animate="animate" exit="exit">
              <ListItemText primary={emptyMessage} />
            </MotionListItem>
          }
        </AnimatePresence>
      </List>
    </Grid>
  )
}

const ForwardListItem = forwardRef<HTMLLIElement, ListItemProps & HTMLMotionProps<"li">>((props, ref) => <ListItem ref={ref} {...props} />);
const MotionListItem = motion(ForwardListItem);