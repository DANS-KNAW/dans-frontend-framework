import Grid from "@mui/material/Grid";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Fragment, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { evaluateCriterion, calcTotals, type Criterion, type Totals, type Test as TestType, type Assessment as AssessmentType } from "./helpers";
import { TooltipWithIcon } from "../Tooltip";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchAnswer, fetchAssessment, fetchAssessmentList } from "./api";
import { fetchUserPids, Pid } from "../user/api";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MotionGrid, MotionPaper } from "../Animations";
import { AnimatePresence, LayoutGroup } from "framer-motion";

const steps = [{
  label: 'Select dataset',
  component: 'dataset',
}, { 
  label: 'Select assessment',
  component: 'assessment',
}, {
  label: 'Perform assessment',
  component: 'perform',
}];

export default function AssessmentSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDatasets, setSelectedDatasets] = useState<Pid[]>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<AssessmentType[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container>
      <Typography variant="h1">
        Perform assessment
      </Typography>
      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((step) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        steps[activeStep]?.component === 'dataset' ?
        <DatasetSelection 
          selectedDatasets={selectedDatasets} 
          setSelectedDatasets={setSelectedDatasets} 
        />:
        steps[activeStep]?.component === 'assessment' ?
        <AssessmentSelection 
          selectedAssessments={selectedAssessments} 
          setSelectedAssessments={setSelectedAssessments} 
        /> :
        steps[activeStep]?.component === 'perform' ?
        <Assessment selectedAssessments={selectedAssessments} selectedDatasets={selectedDatasets} /> : 
        null
      }
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button 
          onClick={handleNext}
          disabled={
            (steps[activeStep]?.component === 'dataset' && selectedDatasets.length === 0) ||
            (steps[activeStep]?.component === 'assessment' && selectedAssessments.length === 0)
          }
        >
          {activeStep === steps.length - 1 ? 'Submit assessment' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
}

function Criterion({ criterion, answers, setAnswers, doi }: { 
  criterion: Criterion, 
  answers: Record<string, string>, 
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>,
  doi: string;
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
            doi={doi}
          />
        )
      })}
    </Box>
  )
}

function Test({ test, answers, setAnswers, doi }: { 
  answers: Record<string, string>, 
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>,
  test: TestType,
  doi: string;
}) {
  const { data, isLoading } = useQuery({ 
    queryKey: ['answer', `${doi}-${test.id}`], 
    queryFn: () => fetchAnswer(test.automation?.api as string, doi),
    enabled: !!test.automation?.api,
  });

  const result = data?.["@graph"]?.find((item: any) => item["@type"] === "ftr:TestResult");

  useEffect(() => {
    if (data && test.automation?.api) {
      const value = result?.["prov:value"]?.["@value"];
      if (value === 'pass') {
        setAnswers((prev) => ({ ...prev, [test.id]: '1' }));
      } else if (value === 'fail') {
        setAnswers((prev) => ({ ...prev, [test.id]: '0' }));
      }
    }
  }, [data, setAnswers, test.id, test.automation?.api]);

  return (
    <Box key={test.id} sx={{ mt: 2, p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
      <Stack direction="row" alignItems="center" mb={1}>
        <TooltipWithIcon status={null} text={test.description} type="test" />
        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ "&.Mui-focused": { color: "inherit" } }}>{test.text}</FormLabel>
      </Stack>
      {
        !test.automation?.api ?

        <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="space-between">
          <FormControl>
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
              console.log(_)
              return rest;
            })}>Clear</Button>
        </Stack> :
        ((isLoading || data) &&
          <Box sx={{ overflowX: 'auto', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1, mt: 2 }}>
            {isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} />
                <Typography>Fetching automated test results...</Typography>
              </Stack>
            ) : (
              data ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">Automated test result:</Typography>
                  <Chip 
                    label={result?.["prov:value"]["@value"]} 
                    color={
                      result?.["prov:value"]["@value"] === 'fail' ? 
                      'error' : 
                      result?.["prov:value"]["@value"] === 'indeterminate' ? 
                      'warning' :
                      'success'} 
                    sx={{ color: 'white'}} 
                  />
                </Stack>
              ) : (
                <Typography color="error">No test result available.</Typography>
              )
            )}
          </Box>
        )
      }
    </Box>
  )
}

function Assessment({ selectedAssessments, selectedDatasets }: { 
  selectedAssessments: AssessmentType[], 
  selectedDatasets: Pid[] 
}) {
  // Create all combinations of datasets and assessments
  const combinations = useMemo(() => {
    const combos: { dataset: Pid; assessment: AssessmentType }[] = [];
    selectedDatasets.forEach(dataset => {
      selectedAssessments.forEach(assessment => {
        combos.push({ dataset, assessment });
      });
    });
    return combos;
  }, [selectedDatasets, selectedAssessments]);

  return (
    <LayoutGroup>
      {combinations.map(({ dataset, assessment }) => (
        <AssessmentInstance
          key={`${dataset.identifier}-${assessment.id}`}
          selectedAssessment={assessment}
          selectedDataset={dataset}
        />
      ))}
    </LayoutGroup>
  );
}

function AssessmentInstance({ selectedAssessment, selectedDataset }: { 
  selectedAssessment: AssessmentType | null, 
  selectedDataset: Pid | null 
}) {
  const { data } = useQuery({ queryKey: ['assessment', selectedAssessment?.id], queryFn: () => fetchAssessment(selectedAssessment?.id) });
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<string | null>(null);
  const [selectedCriterionId, setSelectedCriterionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openPrinciple = selectedPrincipleId ?? data?.principles[0]?.id ?? null;
  const openCriterion = selectedCriterionId ?? data?.principles[0]?.criteria[0]?.id ?? null;


  // useEffect(() => {
  //   setAnswers({});
  // }, [selectedAssessment]);

  // useEffect(() => {
  //   if (data) {
  //     setOpenPrinciple(data.principles[0].id);
  //     setOpenCriterion(data.principles[0].criteria[0].id);
  //   }
  // }, [data]);

  // Create a flat array of tests with automation to maintain order
  const automatedTests = useMemo(() => 
    data?.principles.flatMap((principle) => 
      principle.criteria.flatMap((criterion) => 
        criterion.metric.tests
          .filter(test => test.automation?.api)
          .map(test => ({ test, principleId: principle.id, criterionId: criterion.id }))
      )
    ) || [],
    [data]
  );

  // for each assessment test that has an automation api, fetch the answer
  const testQueries = useQueries({
    queries: automatedTests.map(({ test }) => ({
      queryKey: ['answer', `${selectedDataset?.identifier || ''}-${test.id}`],
      queryFn: () => fetchAnswer(test.automation?.api as string, selectedDataset?.identifier || ''),
    })),
  });

  const allData = useMemo(() => 
    testQueries.map((query, index) => ({
      testId: automatedTests[index].test.id,
      principleId: automatedTests[index].principleId,
      criterionId: automatedTests[index].criterionId,
      data: query.data,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error
    })),
    [testQueries, automatedTests]
  );
  
  // Create a stable key based on which queries have data
  const queriesDataKey = testQueries
    .map(q => q.data ? '1' : '0')
    .join('');

  console.log(queriesDataKey)

  // Update answers based on fetched data
  // useEffect(() => {
  //   const newAnswers: Record<string, string> = {};
    
  //   testQueries.forEach((query, index) => {
  //     if (query.data) {
  //       const testId = automatedTests[index]?.test.id;
  //       if (query.data["@graph"]?.length > 0) {
  //         const result = query.data["@graph"].find((item: any) => item["@type"] === "ftr:TestResult");
  //         if (result) {
  //           const value = result["prov:value"]?.["@value"] || '';
  //           if (testId && (value === 'pass' || value === 'fail')) {
  //             newAnswers[testId] = value === 'pass' ? '1' : '0';
  //           }
  //           return;
  //         }
  //       } 
  //     }
  //   });
    
  //   if (Object.keys(newAnswers).length > 0) {
  //     setAnswers((prev) => ({ ...prev, ...newAnswers }));
  //   }
  // }, [queriesDataKey, selectedDataset?.identifier]); 

  const goToCriterion = (direction: 'next' | 'previous') => {
    const flatCriteria = data?.principles.flatMap(p => p.criteria);
    const currentIndex = flatCriteria?.findIndex(c => c.id === openCriterion);

    if (currentIndex === -1 || !currentIndex || !flatCriteria) return; // no current criterion found
    else {
      const offset = direction === 'next' ? 1 : -1;
      const newIndex = (currentIndex + offset + flatCriteria.length) % flatCriteria.length;
      const newCriterion = flatCriteria[newIndex];

      setSelectedCriterionId(newCriterion.id);

      const newPrinciple = data?.principles.find(p =>
        p.criteria.some(c => c.id === newCriterion.id)
      );

      if (newPrinciple) {
        setSelectedPrincipleId(newPrinciple.id);
      }
    }
  };
  
  return (
    <MotionPaper sx={{mb: 1}} layout>
      <MotionGrid container layout="position" sx={{ position: 'relative', zIndex: 100, backgroundColor: 'background.paper' }}>
        <Status 
          answers={answers} 
          selectedAssessment={data} 
          selectedDataset={selectedDataset} 
          setIsOpen={setIsOpen} 
          isOpen={isOpen}
          isLoading={allData.some(d => d.isLoading)}
        />
      </MotionGrid>
      <AnimatePresence>
        {isOpen && 
          <MotionGrid 
            key={`${selectedDataset?.identifier}-${selectedAssessment?.id}-assessment-grid`}
            container
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            layout
          >
            <Grid size={{ md: 4 }} pt={3} sx={{ borderRight: { md: '1px solid rgba(0, 0, 0, 0.12)' } }}>
              <List
                sx={{ width: '100%' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader sx={{ px: 4 }}>
                    Principles & criteria
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
                    allData.find(d => d.principleId === principle.id && d.isLoading) ? "loading" :
                    null;

                  return (
                    <Fragment key={principle.id}>
                      <ListItemButton 
                        sx={{ px: 4}}
                        onClick={() => {
                          setSelectedPrincipleId(principle.id);
                          setSelectedCriterionId(principle.criteria[0].id);
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
                              allData.find(d => d.criterionId === criterion.id && d.isLoading) ? "loading" :
                              null;
                            return (
                              <ListItemButton
                                key={criterion.id}
                                sx={{ pl: 6, pr: 4 }}
                                onClick={() => setSelectedCriterionId(criterion.id)}
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
            <Grid size={{ md: 8 }} p={4}>
              <Criterion
                criterion={data?.principles.find(
                  (p) => p.id === openPrinciple)?.criteria.find(
                    (criterion) => criterion.id === openCriterion
                  ) as Criterion
                }
                answers={answers}
                setAnswers={setAnswers}
                doi={selectedDataset?.identifier || ''}
              />
              <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
                <Button variant="contained" color="neutral" onClick={() => goToCriterion('previous')}>Previous</Button>
                <Button variant="contained" onClick={() => goToCriterion('next')}>Next</Button>
              </Stack>
            </Grid>
          </MotionGrid>
        }
      </AnimatePresence>
    </MotionPaper>
  )
}

function AssessmentSelection({ selectedAssessments, setSelectedAssessments }: {
  selectedAssessments: AssessmentType[],
  setSelectedAssessments: React.Dispatch<React.SetStateAction<AssessmentType[]>>
}) {
  return (
    <SelectionList
      queryKey="assessment"
      queryFn={async () => (await fetchAssessmentList()) ?? []}
      selectedItems={selectedAssessments}
      setSelectedItems={setSelectedAssessments}
      subheaderText="Select assessments you want to perform"
      getItemKey={(item) => item.name}
      getItemPrimary={(item) => item.name}
      getItemSecondary={(item) => item.description}
      isSelected={(item, selected) => selected.some(s => s.id === item.id)}
    />
  );
}

function DatasetSelection({ selectedDatasets, setSelectedDatasets }: {
  selectedDatasets: Pid[],
  setSelectedDatasets: React.Dispatch<React.SetStateAction<Pid[]>>
}) {
  return (
    <SelectionList
      queryKey="userPids"
      queryFn={async () => (await fetchUserPids()) ?? []}
      selectedItems={selectedDatasets}
      setSelectedItems={setSelectedDatasets}
      subheaderText="Select datasets to assess"
      getItemKey={(item) => item.identifier}
      getItemPrimary={(item) => item.title}
      getItemSecondary={(item) => item.collections.join(', ')}
      isSelected={(item, selected) => selected.some(s => s.identifier === item.identifier)}
    />
  );
}

function SelectionList<T>({
  queryKey,
  queryFn,
  selectedItems,
  setSelectedItems,
  subheaderText,
  getItemKey,
  getItemPrimary,
  getItemSecondary,
  isSelected
}: {
  queryKey: string;
  queryFn: () => Promise<T[]>;
  selectedItems: T[];
  setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>;
  subheaderText: string;
  getItemKey: (item: T) => string;
  getItemPrimary: (item: T) => string;
  getItemSecondary: (item: T) => string;
  isSelected: (item: T, selected: T[]) => boolean;
}) {
  const { data } = useQuery({ queryKey: [queryKey], queryFn });

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {subheaderText}
          </ListSubheader>
        }
      >
        {data?.map((item) => {
          const key = getItemKey(item);
          return (
            <ListItem key={key} disablePadding>
              <ListItemButton 
                role={undefined} 
                onClick={() => setSelectedItems(prev => 
                  isSelected(item, prev)
                    ? prev.filter(i => getItemKey(i) !== key)
                    : [...prev, item]
                )} 
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isSelected(item, selectedItems)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': key }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={key}
                  primary={getItemPrimary(item)}
                  secondary={getItemSecondary(item)}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}

function Status({ answers, selectedAssessment, selectedDataset, setIsOpen, isOpen, isLoading }: { 
  answers: Record<string, string>,
  selectedAssessment?: AssessmentType | null,
  selectedDataset?: Pid | null,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isOpen: boolean,
  isLoading: boolean
}) {
  const mandatoryCriteria: Criterion[] = selectedAssessment?.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Mandatory') || [];
  const optionalCriteria: Criterion[] = selectedAssessment?.principles.flatMap(p => p.criteria).filter(c => c.imperative === 'Optional') || [];
  const mandatoryTotals = calcTotals(mandatoryCriteria, answers);
  const optionalTotals = calcTotals(optionalCriteria, answers);

  return (
    <>
      <Grid size={{ md: 4 }}>
        <Box sx={{px: 4, py: 2}}>
          <Typography variant="body2" sx={{ color: 'neutral.dark', fontWeight: 'bold' }}>
            Dataset
          </Typography>
          <Typography variant="h6">
            {selectedDataset?.title}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ md: 7 }}>
        <Box sx={{px: 4, py: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">
            <Typography variant="body2" sx={{ color: 'neutral.dark', fontWeight: 'bold', mr: 0.75 }} component="span">
              Assessment
            </Typography>
            {selectedAssessment?.name}
          </Typography>
          <Stack direction="column" spacing={1} alignItems="center" sx={{ height: '100%', width: '100%'}}>
            <Progress variant="mandatory" totals={mandatoryTotals} isLoading={isLoading} />
            <Progress variant="optional" totals={optionalTotals} isLoading={isLoading} />
          </Stack>
        </Box>
      </Grid>
      <Grid size={{ md: 1 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          onClick={() => setIsOpen(prev => !prev)}
        >
          <KeyboardArrowDownIcon fontSize="large" sx={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>
      </Grid>
      <Divider sx={{ width: '100%' }} />
    </>
  )
}

function Progress({ variant, totals, isLoading }: { variant: 'mandatory' | 'optional', totals: Totals, isLoading: boolean }) {
  const passedPercentage = (totals.passed / totals.total) * 100;
  const failedPercentage = (totals.failed / totals.total) * 100;

  return (
    <Stack alignItems="center" spacing={2} direction="row" sx={{ width: '100%' }}>
      <Box sx={{ flex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            height: 12, 
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            position: 'relative',
            ...(isLoading && {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.3), transparent)',
                animation: 'slide 1s infinite',
              },
              '@keyframes slide': {
                '0%': {
                  left: '-100%',
                },
                '100%': {
                  left: '100%',
                },
              },
            }),
          }}
        >
          <Box 
            sx={{ 
              width: `${passedPercentage}%`, 
              backgroundColor: 'success.main',
              transition: 'width 0.3s ease'
            }} 
          />
          <Box 
            sx={{ 
              width: `${failedPercentage}%`, 
              backgroundColor: 'error.main',
              transition: 'width 0.3s ease'
            }} 
          />
        </Box>
        <Stack direction="row" spacing={2} mt={0.5} justifyContent="flex-start" alignItems="center">
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              {totals.total}
            </Box> {variant === 'mandatory' ? 'mandatory criteria' : 'optional criteria'}
          </Typography>
          <Stack direction="row" spacing={2} mt={0.5} justifyContent="flex-start" alignItems="center">
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
              <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                {totals.passed}
              </Box> passed
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
              <Box component="span" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                {totals.failed}
              </Box> failed
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}