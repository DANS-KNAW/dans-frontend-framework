import { 
  useState, 
  type SyntheticEvent, 
  useEffect, 
  useMemo, 
  forwardRef,
  type SetStateAction, 
  type Dispatch, 
} from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import { useAuth } from "react-oidc-context";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useQuery } from "@tanstack/react-query";
import { 
  fetchPid, 
  fetchRepositories, 
  fetchRepositoryDetails, 
  fetchRor, 
  type Pid, 
  type Obj, 
  type RorResponse,
  type Collection,
} from "./api";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import FormGroup from '@mui/material/FormGroup';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import FolderIcon from '@mui/icons-material/Folder';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useDebounce } from "use-debounce";
import DatasetIcon from '@mui/icons-material/Dataset';
import { LayoutGroup, AnimatePresence } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import { Notice, CardHeader, TabPanel, SelectedItem, SelectedItems } from "./Common";
import { useUniqueUnselectedList } from "./hooks";
import { fixedOptions, tabs, tempRoles } from "./constants";

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
                  {tab.id === 'repositories' && <Repositories objects={objects} repositories={repositories} setRepositories={setRepositories} />}
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
        <CardHeader 
          title="My role(s)"
          subtitle="Select one or more roles that apply to you. These roles will be used to determine your access and permissions within the FAIR assessment system."
        />
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
  const { data, isLoading } = useQuery({ queryKey: ['pid', id], queryFn: () => fetchPid(id), enabled: !!id });
  const isSelected = data && objects.some(r => r.identifier === data.identifier) || false;

  return (
    <Grid container spacing={6}>
      <Grid xs={12} md={6}>
        <CardHeader 
          title="Add new PID"
          subtitle="Enter a PID for one of your datasets to look up the corresponding repository and collections."
        />
        <Stack direction="row" spacing={1}>
          <TextField label="PID" fullWidth value={activeId} onChange={(e) => setActiveId(e.target.value)} />
          <Button variant="contained" onClick={() => setId(activeId)} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Find"}
          </Button>
        </Stack>
        {data && activeId === id && activeId && (
          <Notice 
            title="Dataset found"
            isSelected={isSelected}
            onClick={() => {
              setActiveId("");
              setId("");
              setObjects([...objects, data])
            }}
          >
            <Typography variant="body2">
              Dataset: {data.title}
            </Typography>
            <Typography variant="body2">
              Repository: {data.repository.name}
            </Typography>
            <Typography variant="body2">
              Collections: {data.collections.join(', ')}
            </Typography>
          </Notice>
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

function Repositories({ repositories, setRepositories, objects }: { repositories: Obj[]; setRepositories: Dispatch<SetStateAction<Obj[]>>; objects: Pid[] }) {
  const [ repo, setRepo ] = useState<Obj>();
  const { data, isLoading } = useQuery({ queryKey: ['repositories'], queryFn: () => fetchRepositories() });
  const { data: dataDetails, } = useQuery({ queryKey: ['repositoryDetails', repo?.id], queryFn: () => fetchRepositoryDetails(repo!.id), enabled: !!repo?.id });
  const isSelected = dataDetails && repositories.some(r => r.id === dataDetails.id) || false;
  const objectList = useUniqueUnselectedList(objects, repositories, obj => obj.repository ? [obj.repository] : []);

  return (
    <Grid container spacing={6}>
      <Grid xs={12} md={6}>
        <CardHeader 
          title="Add repository"
          subtitle={objects && objects.length > 0 ? "Select a repository associated with one of your datasets" : "Please select a dataset first to see associated repositories."}
        
        />
        {objectList.length > 0 && (
          <List dense>
            <AnimatePresence initial={false} mode="popLayout">
              {objectList.map((item) => {
                const collections = objects.find(obj => obj.repository.id === item.id)?.collections.map(c => ({name: c, enabled: true}));
                return (
                  <PreselectedRepo key={item.id} id={item.id} setRepositories={setRepositories} repositories={repositories} collections={collections} />
                );
              })}
            </AnimatePresence>
          </List>
        )}

        <Typography variant="body2" mb={1}>
          Or find your repository in the Re3Data database
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
          <Notice 
            title="Repository info"
            isSelected={isSelected}
            onClick={() => {
              setRepositories([...repositories, {...repo, url: dataDetails.url, institutions: dataDetails.institutions}])
              setRepo(undefined);
            }}
          >
            <Typography variant="body2">
              Name: {dataDetails.name}
            </Typography>
            <Typography variant="body2">
              Institutions: {dataDetails.institutions.map(inst => inst.name).join(', ')}
            </Typography>
            <Typography variant="body2">
              URL: <Link href={dataDetails.url} target="_blank">{dataDetails.url}</Link>
            </Typography>
          </Notice>
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

type PreselectedRepoProps = {
  id: string;
  setRepositories: Dispatch<React.SetStateAction<Obj[]>>;
  repositories: Obj[];
  collections?: Collection[];
}

const PreselectedRepo = forwardRef<HTMLLIElement, PreselectedRepoProps>(
  ({ id, setRepositories, repositories, collections }, ref) => {
    const { data, isLoading } = useQuery({ queryKey: ['repositoryDetails', id], queryFn: () => fetchRepositoryDetails(id) });
    return (
      <SelectedItem 
        ref={ref}
        key={id}
        item={data}
        onClick={() => data && setRepositories([...repositories, {...data, url: data.url, institutions: data.institutions, collections: collections }])}
        icon={isLoading ? <CircularProgress size={12} /> : <FolderIcon />} 
      />
    );
  }
)

function Institutions({ selectedRepositories, institutions, setInstitutions }: { selectedRepositories?: Obj[], institutions: Obj[], setInstitutions: Dispatch<SetStateAction<Obj[]>> }) {
  const [ rorValue, setRorValue ] = useState<string>("");
  const debouncedRorValue = useDebounce(rorValue, 500)[0];
  const [ customRor, setCustomRor ] = useState<RorResponse>();
  const { data: rorData, isLoading } = useQuery({ queryKey: ['ror', debouncedRorValue], queryFn: () => fetchRor(debouncedRorValue), enabled: !!debouncedRorValue });

  const rorList = useUniqueUnselectedList(selectedRepositories, institutions, (repo) =>
    (repo.institutions ?? [])
      .map((inst) => {
        const ror = inst.id.find((id) => id.type === "ROR");
        return ror ? { id: ror.value, name: inst.name } : null;
      })
      .filter((i): i is { id: string; name: string } => i !== null)
  );

  return (
    <LayoutGroup>
      <Grid container spacing={6}>
        <Grid xs={12} md={6}>
          <CardHeader 
            title="Add institution"
            subtitle={selectedRepositories && selectedRepositories.length > 0 ? 
              "Select an institution associated with one of your repositories" : 
              "Please select a repository first to see associated institutions."
            }
          />
          {rorList.length > 0 && (
            <List dense>
              <AnimatePresence initial={false} mode="popLayout">
                {rorList.map((item) => (
                  <SelectedItem 
                    key={item.id}
                    item={item}
                    onClick={() => setInstitutions([...institutions, {...item, url: item.id?.replace("ROR:", "https://ror.org/") }])}
                    icon={<AccountBalanceIcon />} />
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
            getOptionLabel={(option) => option?.names.filter(name => name.types.indexOf("ror_display") !== -1)[0].value || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={customRor}
            inputValue={rorValue}
            onInputChange={(_e, newValue) => {
              setRorValue(newValue);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option?.names?.filter(name => name.types.indexOf("ror_display") !== -1)[0].value || ""}
              </li>
            )}
            onChange={(_event, newValue) => {
              if (newValue && !institutions.some(i => i.id === newValue.id.replace("https://ror.org/", "ROR:"))) {
                !institutions.some(inst => inst.id === newValue.id) && setInstitutions([...institutions, {
                  name: newValue.names.filter(name => name.types.indexOf("ror_display") !== -1)[0].value,
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
