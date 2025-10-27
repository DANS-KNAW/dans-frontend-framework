import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Fragment, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import { Divider } from "@mui/material";


function Assessment() {
  const [openPrinciple, setOpenPrinciple] = useState(tempJson.principles[0].id);
  const [openCriterion, setOpenCriterion] = useState<string | null>(tempJson.principles[0].criteria[0].id);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  const goToCriterion = (direction: 'next' | 'previous') => {
    const flatCriteria = tempJson.principles.flatMap(p => p.criteria);
    const currentIndex = flatCriteria.findIndex(c => c.id === openCriterion);

    if (currentIndex === -1) return; // no current criterion found

    const offset = direction === 'next' ? 1 : -1;
    const newIndex = (currentIndex + offset + flatCriteria.length) % flatCriteria.length;
    const newCriterion = flatCriteria[newIndex];

    setOpenCriterion(newCriterion.id);

    const newPrinciple = tempJson.principles.find(p =>
      p.criteria.some(c => c.id === newCriterion.id)
    );

    if (newPrinciple) {
      setOpenPrinciple(newPrinciple.id);
    }
  };

  return (
    <Container>
      <Typography variant="h1">
        Perform assessment
      </Typography>
      <Paper>
        <Grid container>
          <Grid xs={12}>
            <Status answers={answers} />
            <Divider />
          </Grid>
          <Grid md={4} pt={3} sx={{ borderRight: { md: '1px solid rgba(0, 0, 0, 0.12)' } }}>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader sx={{ px: 4 }}>
                  {tempJson.assessment_type.name}: Principles & criteria
                </ListSubheader>
              }
            >
              {tempJson.principles.map((principle) => {
                // Helper to check if criterion is answered
                const isPrincipleAnswered = principle.criteria.every((criterion: any) => criterion.metric.tests.every((test: any) => answers[test.id] !== undefined));
                const isPrinciplePartiallyAnswered = principle.criteria.some((criterion: any) => criterion.metric.tests.some((test: any) => answers[test.id] !== undefined)) && !isPrincipleAnswered;
                const isPrinciplePassed = principle.criteria.every((criterion: any) => criterion.metric.tests.every((test: any) => answers[test.id] === "1"));
                const status = isPrinciplePassed ? 'success' : isPrincipleAnswered ? 'error' : isPrinciplePartiallyAnswered ? 'warning' : null;
                return (
                  <Fragment key={principle.id}>
                    <ListItemButton 
                      sx={{ px: 4}}
                      onClick={() => {
                        setOpenPrinciple(principle.id);
                        setOpenCriterion(principle.criteria[0].id);
                      }}
                    >
                      <TooltipWithIcon status={status} text={principle.description} type="principle" />
                      <ListItemText primary={principle.name} />
                      {openPrinciple === principle.id ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openPrinciple === principle.id} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {principle.criteria.map((criterion) => {
                          const tests = criterion.metric.tests;
                          const allAnswered = tests.every((t: any) => answers[t.id] !== undefined);      
                          const allPassed = tests.every((t: any) => answers[t.id] === "1");
                          const status = allPassed ? 'success' : allAnswered ? 'error' : null;
                          return (
                            <ListItemButton
                              key={criterion.id}
                              sx={{ pl: 6, pr: 4 }}
                              onClick={() => setOpenCriterion(criterion.id)}
                              selected={openCriterion === criterion.id}
                            >
                              <TooltipWithIcon status={status} text={criterion.description} type="criterion" />
                              <ListItemText primary={criterion.description} />
                              <Chip 
                                label={criterion.imperative} 
                                size="small" 
                                variant="outlined"
                                color={allPassed ? "success" : criterion.imperative === "Mandatory" ? "error" : "warning"}
                                sx={{
                                  fontSize: '0.6rem',
                                  ml: 0.5,
                                  fontWeight: 'bold',
                                  borderWidth: '2px'
                                }}
                              />
                            </ListItemButton>
                          )
                        })}
                      </List>
                    </Collapse>
                  </Fragment>
                )
              })}
            </List>
          </Grid>
          <Grid md={8} p={4}>
            <Criterion
              criterion={tempJson.principles.find(
                (p) => p.id === openPrinciple)?.criteria.find(
                  (criterion) => criterion.id === openCriterion
                )
              }
              answers={answers}
              setAnswers={setAnswers}
            />
            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button variant="contained" color="neutral" onClick={() => goToCriterion('previous')}>Previous</Button>
              <Button variant="contained" onClick={() => goToCriterion('next')}>Next</Button>
            </Stack>
          </Grid>          
        </Grid>
      </Paper>
    </Container>
  )
}

function Criterion({ criterion, answers, setAnswers }: { criterion: any, answers: any, setAnswers: any }) {
  return (
    criterion &&
    <Box>
      <Typography variant="h2">
        {criterion.description}
      </Typography>
      {criterion.metric.tests.map((test: any) => {
        const status = answers[test.id] === "1" ? "success" : answers[test.id] === "0" ? "error" : null
        return (
          <Box key={test.id} sx={{ mt: 2, p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="space-between">
              <FormControl>
                <Stack direction="row" alignItems="center" mb={1}>
                  <TooltipWithIcon status={status} text={test.description} type="test" />
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{ "&.Mui-focused": { color: "inherit" } }}>{test.text}</FormLabel>
                </Stack>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={answers[test.id] || ''}
                  sx={{ ml: 5}}
                  onChange={(e) => setAnswers({ ...answers, [test.id]: e.target.value })}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              <Button onClick={() => setAnswers((prev: any) => {
                const { [test.id]: _, ...rest } = prev;
                return rest;
              })}>Clear</Button>
            </Stack>
          </Box>
        )
      })}
    </Box>
  )
}

const StatusTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 0,
    boxShadow: theme.shadows[1],
  },
}));

function TooltipWithIcon({ status, text, type }: { status: 'success' | 'error' | 'warning' | null, text: string, type: 'principle' | 'criterion' | 'test' }) {
  return (
    <StatusTooltip 
      title={
        <TooltipContent 
          text={text} 
          color={status}
          type={type}
        />
      }
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <GuidanceIcons status={status} />
      </ListItemIcon>
    </StatusTooltip>
  )
}

function GuidanceIcons({ status }: { status: 'success' | 'error' | 'warning' | null }) {
  if (status === 'success') {
    return <CheckCircleIcon color="success" />;
  }
  if (status === 'error') {
    return <ErrorIcon color="error" />;
  }
  if (status === 'warning') {
    return <ErrorIcon color="warning" />;
  }
  return <HelpOutlineIcon color="disabled" />;
}

function TooltipContent ({ text, color, type }: { text: string, color: string | null, type: 'principle' | 'criterion' | 'test' }) {
  return (
    <>
       <Typography color="inherit" variant="body2" sx={{ p: 2 }}>{text}</Typography>
       {color && (
         <Box sx={{ px: 2, py: 1, backgroundColor: `${color}.main` }}>
           <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem" }}>
              This {type} is marked as {color === "success" ? "passed" : color === "error" ? "failed" : "partially passed"}.
           </Typography>
         </Box>
       )}
    </>
  )
}

function Status({ answers }: { answers: any }) {
  const mandatoryCriteria = tempJson.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Mandatory');
  const optionalCriteria = tempJson.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Optional');
  const mandatoryTotals = calcTotals(mandatoryCriteria, answers);
  const optionalTotals = calcTotals(optionalCriteria, answers);
  return (
    <Stack sx={{ px: 4, py: 3 }} direction="row" spacing={6} alignItems="center" justifyContent="space-between">
      <FormControl sx={{ flex: "1"}}>
        <InputLabel id="select-dataset-label">Assess data set</InputLabel>
        <Select
          labelId="select-dataset-label"
          id="select-dataset"
          label="Assess data set"
          value="0"
          renderValue={() => "DEMO doi:XXX - Interview met Dionne Sillé, Amsterdam, 17 Januari 2025"}
        >
          <MenuItem value={0}>
          <Box>
            <Typography>DEMO doi:XXX - Interview met Dionne Sillé, Amsterdam, 17 Januari 2025</Typography>
            <Typography variant="body2" color="neutral.dark">CESSDA-NL | DANS Data Station Social Sciences and Humanities | Data Archiving and Networked Services</Typography>
          </Box>
          </MenuItem>
        </Select>
        <FormHelperText sx={{ fontSize: "0.7rem", mb: -1 }}>Select one of your data sets from the added objects in your user settings</FormHelperText>
      </FormControl>
      <Stack direction="row" spacing={2} alignItems="center">
        <Progress variant="mandatory" totals={mandatoryTotals} />
        <Progress variant="optional" totals={optionalTotals} />
      </Stack>
      <Button variant="contained" size="large" disabled={mandatoryTotals.passed + mandatoryTotals.failed !== mandatoryTotals.total} onClick={() => null}>Submit assessment</Button>
    </Stack>
  )
}

// Calculate progress based on tempJson data and answers. Checks if question is mandatory or optional and if metric tests are all answered and passed
function calcTotals(criteria: any[], answers: Record<string, any>) {
  const counts = { passed: 0, failed: 0, total: criteria.length };

  for (const c of criteria) {
    const tests: any[] = c?.metric?.tests ?? [];
    if (tests.length === 0) continue;

    if (c.metric.algorithm === "sum" && c.metric.benchmark.hasOwnProperty("equal_greater_than")) {
      // simple sum algorithm
      const testAnswers = tests.map(t => answers[t.id]).filter(v => v !== undefined);
      if (testAnswers.length !== tests.length) continue;
      const allPassed = testAnswers.reduce((partialSum, a) => partialSum + parseInt(a), 0) >= parseInt(c.metric.benchmark.equal_greater_than)
      counts[allPassed ? "passed" : "failed"]++;
    }
    // other algorithms...
  }

  return counts;
}

function Progress({ variant, totals }: { variant: 'mandatory' | 'optional', totals: any }) {
  return (
    <Stack alignItems="center" spacing={0} direction={{ xs: 'column', md: 'column'}}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate" 
          value={100}
          sx={{ color: 'neutral.light', position: 'absolute', left: 0 }}
          size={70}
        />
        <CircularProgress
          variant="determinate" 
          value={((totals.passed + totals.failed) / totals.total) * 100}
          sx={{ 
            color: 'error.main',
            position: 'absolute',
            left: 0
          }}
          size={70}
        />
        <CircularProgress
          variant="determinate" 
          value={(totals.passed / totals.total) * 100}
          sx={{ color: 'success.main' }}
          size={70}
        />
        <Box sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary', fontSize: '0.5rem' }}
          >
            {totals.passed} passed
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary', fontSize: '0.5rem' }}
          >
            {totals.failed} failed
          </Typography>
        </Box>
      </Box>
      <FormHelperText sx={{ fontSize: '0.7rem', mt: 0.5 }}>
        {totals.total} {variant === 'mandatory' ? 'mandatory criteria' : 'optional criteria'}
      </FormHelperText>
    </Stack>
  );
}

export default Assessment;


// temp junk
const tempJson = {
  "name": "EDC Test Object",
  "version": "",
  "status": "",
  "published": false,
  "timestamp": "",
  "actor": {
    "id": 5,
    "name": "Repository Manager"
  },
  "organisation": {
    "id": "",
    "name": ""
  },
  "subject": {
    "id": "",
    "name": "",
    "type": ""
  },
  "result": {
    "compliance": null,
    "ranking": null
  },
  "principles": [
    {
      "criteria": [
        {
          "id": "cat_graph:cri.872879D3",
          "name": "F1",
          "description": "Data is assigned a globally unique persistent identifier",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.D24084ED",
            "name": "M37",
            "description": "Data is assigned a globally unique persistent identifier",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.FC028697",
                "name": "T1",
                "description": "Data MUST be assigned a globally unique identifier",
                "text": "Is your data(set) assigned a globally unique persistent and resolvable identifier?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.7DB8D95B",
          "name": "F2",
          "description": "Metadata includes descriptive core elements (creator, title, data identifier, publisher, publication date, summary and keywords) to support data findability.",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.D7C1C593",
            "name": "M38",
            "description": "Metadata includes descriptive core elements (creator, title, data identifier, publisher, publication date, summary and keywords) to support data findability.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.6A94BFD9",
                "name": "T2",
                "description": "Metadata MUST include descriptive core elements (creator, title, data identifier, publisher, publication date, summary and keywords) to support data findability.",
                "text": "Did you provide discovery metadata in order to make the data(set) findable, understandable and reusable to others?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.DC621522",
          "name": "F3",
          "description": "Metadata includes the identifier of the data it describes.",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.45F5CD1E",
            "name": "M51",
            "description": "Metadata includes the identifier of the data it describes.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.5DEB61B7",
                "name": "T12",
                "description": "The metadata MUST include the identifier of the data or object it describes",
                "text": "Does the metadata also include the identifier of the dataset it describes?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        }
      ],
      "id": "cat_graph:pri.EF08FF2D",
      "name": "Findable",
      "description": "The first step in (re)using data is to find them. Metadata and data should be easy to find for both humans and computers. Machine-readable metadata are essential for automatic discovery of datasets and services, so this is an essential component of the FAIRification process."
    },
    {
      "criteria": [
        {
          "id": "cat_graph:cri.0F68B27E",
          "name": "A1",
          "description": "Metadata contains access level and access conditions of the data.",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.37631D77",
            "name": "M47",
            "description": "Metadata contains access level and access conditions of the data.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 2
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.1E7EA548",
                "name": "T13",
                "description": "The metadata SHOULD include access conditions, if applicable, and preferably include these access conditions in the licence. ",
                "text": "Does the metadata or the licence describe access conditions, if applicable?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              },
              {
                "type": "binary",
                "id": "cat_graph:tes.1E7EAXXX",
                "name": "T14",
                "description": "This is a dummy test to show multiple tests per criterion." ,
                "text": "Is this a dummy test to show multiple tests per criterion?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.17BC3F4",
          "name": "A2",
          "description": "Metadata remains available, even if the data is no longer available.",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.12A64244",
            "name": "M41",
            "description": "Metadata remains available, even if the data is no longer available.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.76F972C1",
                "name": "T5",
                "description": "Metadata MUST remain accessible even if data is no longer available.",
                "text": "Do you ensure that the metadata remains available over time, even if the data(set) is no longer accessible?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        }
      ],
      "id": "cat_graph:pri.E3BD9B49",
      "name": "Accessible",
      "description": "Once the user finds the required data, she/he/they need to know how they can be accessed, possibly including authentication and authorisation."
    },
    {
      "criteria": [
        {
          "id": "cat_graph:cri.EE5A9081",
          "name": "I1",
          "description": "Metadata is represented using a formal knowledge representation language.",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.0BBF4218",
            "name": "M42",
            "description": "Metadata is represented using a formal knowledge representation language.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.DD81CB11",
                "name": "T7",
                "description": "Metadata SHOULD be represented using a formal knowledge representation language.",
                "text": "Does the metadata describing your data(set) conform to or is it transformable to a formal knowledge representation language?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.0D90C135",
          "name": "I2",
          "description": "Metadata uses semantic resources",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.65456EB0",
            "name": "M43",
            "description": "Metadata uses semantic resources",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.28F8AECC",
                "name": "T14",
                "description": "Metadata SHOULD maximally make use of appropriate vocabularies.",
                "text": "Does the metadata describing your data(set) use controlled vocabularies whenever appolicable?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        }
      ],
      "id": "cat_graph:pri.04A081E5",
      "name": "Interoperable",
      "description": "The data usually need to be integrated with other data. In addition, the data need to interoperate with applications or workflows for analysis, storage, and processing."
    },
    {
      "criteria": [
        {
          "id": "cat_graph:cri.EA85B26D",
          "name": "R1",
          "description": "(Meta)data are richly described with a plurality of accurate and relevant attributes",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.63B2BD37",
            "name": "M50",
            "description": "(Meta)data are richly described with a plurality of accurate and relevant attributes",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.DBA3F17E",
                "name": "T16",
                "description": "Metadata SHOULD support reuse with rich metadata, describing detailed aspects of methodology, variables, instruments, and data schema.",
                "text": "Does the metadata support reusability with descriptions of methids, instruments, and a data dictionary?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.537F2ECE",
          "name": "R2",
          "description": "Metadata includes licence information under which data can be reused.",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.26DC001D",
            "name": "M40",
            "description": "Metadata includes licence information under which data can be reused.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.8ACFC9CA",
                "name": "T4",
                "description": "Metadata MUST include licence information under which data can be reused.",
                "text": "Does the metadata include the licence information under which the data(set) can be reused?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.37419F75",
          "name": "R1.1",
          "description": "Metadata includes provenance information about data creation or generation.",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.3F0D5DBF",
            "name": "M44",
            "description": "Metadata includes provenance information about data creation or generation.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.A1B03265",
                "name": "T8",
                "description": "Metadata SHOULD use semantic resources.",
                "text": "Do you include or reference provenance information about the collection and/or generation of data in the metadata?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.8C35C1BC",
          "name": "R1.2",
          "description": "Metadata follows a standard recommended by the target research community of the data.",
          "imperative": "Mandatory",
          "metric": {
            "id": "cat_graph:mtr.7AF0F257",
            "name": "M45",
            "description": "Metadata follows a standard recommended by the target research community of the data.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.0F10E05C",
                "name": "T9",
                "description": "Metadata SHOULD include provenance information about data creation or generation.",
                "text": "Is the metadata describing your data(set) based on specifications or a standard that is community-endorsed ?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.31150C4D",
          "name": "R1.3",
          "description": "Data is available in a file format recommended by the target research community.",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.AE2C7D24",
            "name": "M46",
            "description": "Data is available in a file format recommended by the target research community.",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.4F02734A",
                "name": "T10",
                "description": "File formats SHOULD follow a standard recommended by the target research community.",
                "text": "Is your data(set) deposited in a file format that is open and supported by the data repository for long-term preservation?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        },
        {
          "id": "cat_graph:cri.C4556D25",
          "name": "R1.4",
          "description": "FAIR maintained over time",
          "imperative": "Optional",
          "metric": {
            "id": "cat_graph:mtr.0842027E",
            "name": "M49",
            "description": "Data curation is the active and ongoing management of data to ensure that it’s available for discovery and reuse. This process covers the entire lifecycle of the data(set), starting at the selection or creation and continuing on for as long as the data(set) exists. ",
            "type": "number",
            "value": null,
            "result": null,
            "algorithm": "sum",
            "benchmark": {
              "equal_greater_than": 1
            },
            "tests": [
              {
                "type": "binary",
                "id": "cat_graph:tes.FA1594A2",
                "name": "T11",
                "description": "Data SHOULD be offered in one or more file formats recommended by the target community.",
                "text": "Does the repository you have deposited in provide professional data curation and digital preservation?",
                "value": null,
                "result": null,
                "guidance": {
                  "id": "",
                  "type": "API",
                  "description": "",
                  "API": ""
                }
              }
            ]
          }
        }
      ],
      "id": "cat_graph:pri.290B375E",
      "name": "Reusable",
      "description": "The ultimate goal of FAIR is to optimise the reuse of data. To achieve this, metadata and data should be well-described so that they can be replicated and/or combined in different settings."
    }
  ],
  "assessment_type": {
    "id": 1,
    "name": "EDC FAIR (Manual)"
  }
};