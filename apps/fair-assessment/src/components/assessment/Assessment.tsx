import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Fragment, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import { Divider } from "@mui/material";
import { evaluateCriterion, calcTotals, type Criterion, type Totals, type Test as TestType } from "./helpers";
import { TooltipWithIcon } from "../Tooltip";
import { useQuery } from "@tanstack/react-query";
import { fetchAnswer, fetchAssessment } from "./api";

function Assessment() {
  const { data } = useQuery({ queryKey: ['assessment'], queryFn: () => fetchAssessment() });
  const [openPrinciple, setOpenPrinciple] = useState<string | null>(null);
  const [openCriterion, setOpenCriterion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setOpenPrinciple(data.principles[0].id);
      setOpenCriterion(data.principles[0].criteria[0].id);
    }
  }, [data]);

  const goToCriterion = (direction: 'next' | 'previous') => {
    const flatCriteria = data?.principles.flatMap(p => p.criteria);
    const currentIndex = flatCriteria?.findIndex(c => c.id === openCriterion);

    if (currentIndex === -1 || !currentIndex || !flatCriteria) return; // no current criterion found
    else {
        const offset = direction === 'next' ? 1 : -1;
        const newIndex = (currentIndex + offset + flatCriteria.length) % flatCriteria.length;
        const newCriterion = flatCriteria[newIndex];

        setOpenCriterion(newCriterion.id);

        const newPrinciple = data?.principles.find(p =>
        p.criteria.some(c => c.id === newCriterion.id)
        );

        if (newPrinciple) {
            setOpenPrinciple(newPrinciple.id);
        }
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
                  {data?.assessment_type.name}: Principles & criteria
                </ListSubheader>
              }
            >
              {data?.principles.map((principle) => {
                const criteriaEvaluations = principle.criteria.map(c => evaluateCriterion(c, answers));

                const allAnswered = criteriaEvaluations.every(r => r.allAnswered);
                const partiallyAnswered = criteriaEvaluations.some(r => r.allAnswered) && !allAnswered;
                const allPassed = criteriaEvaluations.every(r => r.passed === true);

                const status =
                  allPassed ? "success" :
                  allAnswered ? "error" :
                  partiallyAnswered ? "warning" :
                  null;

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
                          const result = criteriaEvaluations.find(r => r.id === criterion.id);
                          const status =
                            result?.passed ? "success" :
                            result?.allAnswered ? "error" :
                            null;
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
              criterion={data?.principles.find(
                (p) => p.id === openPrinciple)?.criteria.find(
                  (criterion) => criterion.id === openCriterion
                ) as Criterion
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

function Criterion({ criterion, answers, setAnswers }: { 
  criterion: Criterion, 
  answers: Record<string, string>, 
  setAnswers: Dispatch<SetStateAction<Record<string, string>>> 
}) {
  return (
    criterion &&
    <Box>
      <Typography variant="h2">
        {criterion.description}
      </Typography>
      {criterion.metric.tests.map((test) => {
        return (
          <Test 
            key={test.id}
            test={test}
            answers={answers} 
            setAnswers={setAnswers} 
          />
        )
      })}
    </Box>
  )
}

function Test({ test, answers, setAnswers }: { 
  answers: Record<string, string>, 
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>,
  test: TestType,
}) {
  const { data, isLoading } = useQuery({ 
    queryKey: ['answer', test.id], 
    queryFn: () => fetchAnswer(test.guidance.API, 'https://dataverse.nl/dataset.xhtml?persistentId=doi:10.34894/DVQTOG'),
    enabled: !!test.guidance.API,
  });

  return (
    <Box key={test.id} sx={{ mt: 2, p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="space-between">
        <FormControl>
          <Stack direction="row" alignItems="center" mb={1}>
            <TooltipWithIcon status={null} text={test.description} type="test" />
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
        <Button onClick={() => setAnswers((prev) => {
          const { [test.id]: _, ...rest } = prev;
          return rest;
        })}>Clear</Button>
      </Stack>
      {(isLoading || data) && 
        <Box sx={{ overflowX: 'auto', backgroundColor: 'neutral.light', p: 2, borderRadius: 1, mt: 2 }}>
          {isLoading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              <Typography>Fetching automated test results...</Typography>
            </Stack>
          ) : (
            data ? (
              <>
                <Typography variant="subtitle2">Test result:</Typography>
                <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
              </>
            ) : (
              <Typography color="error">No test result available.</Typography>
            )
          )}
        </Box>
      }
    </Box>
  )
}

function Status({ answers }: { answers: Record<string, string> }) {
  const { data } = useQuery({ queryKey: ['assessment'], queryFn: () => fetchAssessment() });
  const mandatoryCriteria: Criterion[] = data?.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Mandatory') || [];
  const optionalCriteria: Criterion[] = data?.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Optional') || [];
  const mandatoryTotals = calcTotals(mandatoryCriteria, answers);
  const optionalTotals = calcTotals(optionalCriteria, answers);
  return (
    <Stack sx={{ px: 4, py: 3 }} direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center" justifyContent="space-between">
      <FormControl sx={{ flex: "1", maxWidth: "100%"}}>
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
      <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Progress variant="mandatory" totals={mandatoryTotals} />
          <Progress variant="optional" totals={optionalTotals} />
        </Stack>
        <Button variant="contained" size="large" disabled={mandatoryTotals.passed + mandatoryTotals.failed !== mandatoryTotals.total} onClick={() => null}>Submit assessment</Button>
      </Stack>
    </Stack>
  )
}

function Progress({ variant, totals }: { variant: 'mandatory' | 'optional', totals: Totals }) {
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
