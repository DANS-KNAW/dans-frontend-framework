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
import { Button, Stack } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function Assessment() {
  const [openPrinciple, setOpenPrinciple] = useState(tempJson.principles[0].id);
  const [openCriterion, setOpenCriterion] = useState<string | null>(tempJson.principles[0].criteria[0].id);

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
      <Grid container spacing={4} alignItems="stretch">
        <Grid xs={12}>
          <Typography variant="h1">
            Perform assessment
          </Typography>
        </Grid>
        <Grid md={4}>
          <Paper>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Principles & criteria
                </ListSubheader>
              }
            >
              {tempJson.principles.map((principle) => (
                <Fragment key={principle.id}>
                  <ListItemButton onClick={() => {
                    setOpenPrinciple(principle.id);
                    setOpenCriterion(principle.criteria[0].id);
                  }}>
                    <ListItemIcon>
                      <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary={principle.name} />
                    {openPrinciple === principle.id ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openPrinciple === principle.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {principle.criteria.map((criterion) => (
                        <ListItemButton
                          key={criterion.id}
                          sx={{ pl: 4 }}
                          onClick={() => setOpenCriterion(criterion.id)}
                          selected={openCriterion === criterion.id}
                        >
                          <ListItemIcon>
                            <ErrorIcon color={criterion.imperative === "Mandatory" ? "error" : "warning"} />
                          </ListItemIcon>
                          <ListItemText primary={criterion.description} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid md={8}>
          <Criterion
            criterion={tempJson.principles.find(
              (p) => p.id === openPrinciple)?.criteria.find(
                (criterion) => criterion.id === openCriterion
              )
            }
          />
          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button variant="contained" color="neutral" onClick={() => goToCriterion('previous')}>Previous</Button>
            <Button variant="contained" onClick={() => goToCriterion('next')}>Next</Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

function Criterion({ criterion }: { criterion: any }) {
  return (
    criterion &&
    <Box>
      <Typography variant="h2">
        {criterion.description}
      </Typography>
      {criterion.metric.tests.map((test: any) => (
        <Box key={test.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">{test.text}</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>
      ))}
    </Box>
  )
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
        },
        {
          "id": "cat_graph:cri.0F68B27",
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
              "equal_greater_than": 1
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
              "equal_greater_than": 1
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
          "id": "cat_graph:cri.17BC3F45",
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
        },
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