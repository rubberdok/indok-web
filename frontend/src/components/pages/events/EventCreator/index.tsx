import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_EVENT } from "@graphql/events/mutations";
import { GET_CATEGORIES } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { Category, Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Alert from "@components/Alert";
import SlotDistribution from "../SlotDistribution";
import { DEFAULTINPUT } from "./constants";
import { getFormattedData } from "./helpers";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(5),
    width: "70%",
    margin: "0 auto",
  },
}));

/**
 * Component for the creating a new event
 */

const CreateEvent: React.FC = () => {
  const classes = useStyles();
  const [eventData, setEventData] = useState(DEFAULTINPUT);
  const [isAttendable, setIsAttendable] = useState(false);
  const [hasSlotDistribution, setHasSlotDistribution] = useState(false);
  const [slotDistribution, setSlotDistribution] = useState<{ category: number[]; availableSlots: number }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [openCreateErrorSnackbar, setOpenCreateErrorSnackbar] = useState(false);
  const [openCreateSnackbar, setOpenCreateSnackbar] = useState(false);

  const router = useRouter();

  const [createEvent, { loading: createEventLoading, error: createEventError }] = useMutation<{
    createEvent: { event: Event };
  }>(CREATE_EVENT, {
    update: (cache, { data }) => {
      data &&
        cache.modify({
          fields: {
            allEvents: (existingEvents) => {
              const newEventRef = cache.writeFragment<Event>({
                data: data.createEvent.event,
                fragment: gql`
                  fragment NewEvent on Event {
                    id
                  }
                `,
              });
              return [...existingEvents, newEventRef];
            },
          },
        });
    },
  });

  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(GET_CATEGORIES);
  const { loading: userLoading, error: userError, data: userData } = useQuery<{ user: User }>(GET_USER);

  if (categoryLoading || userLoading) return <CircularProgress />;
  if (categoryError || userError) return <Typography>Det oppstod en feil.</Typography>;

  if (!userData || !userData.user || !userData.user.organizations.length) {
    router.push("/events");
    return null;
  }

  if (!eventData.organizationId) {
    setEventData({ ...eventData, organizationId: userData?.user.organizations[0].id });
  }

  const updateSlotDistribution = (newSlotDistribution: { category: number[]; availableSlots: number }[]) => {
    setSlotDistribution(newSlotDistribution);
    // eslint-disable-next-line prefer-spread
    const usedGrades = [].concat.apply(
      [],
      newSlotDistribution.map((dist) => dist.category)
    );
    setEventData({
      ...eventData,
      allowedGradeYears: usedGrades,
    });
  };

  const onIsAttendableChange = (attendable: boolean) => {
    // Reset all fields depending on isAttendable if isAttendable is disabled
    if (attendable) {
      setIsAttendable(true);
      setHasSlotDistribution(false);
    } else {
      setEventData({
        ...eventData,
        availableSlots: "",
        bindingSignup: false,
        hasExtraInformation: false,
        signupOpenDate: "",
        deadline: "",
        allowedGradeYears: [1, 2, 3, 4, 5],
      });
      setIsAttendable(false);
      setHasSlotDistribution(false);
    }
  };

  const onSubmit = () => {
    const formattedInputData = getFormattedData(eventData, isAttendable, hasSlotDistribution, slotDistribution);

    if (formattedInputData.currentErrors.length > 0) {
      setErrors(formattedData.currentErrors);
      setOpenCreateErrorSnackbar(true);
      return;
    }

    createEvent({
      variables: {
        eventData: formattedInputData.eventInput,
        attendableData: isAttendable ? formattedInputData.attendableInput : undefined,
        slotDistributionData: isAttendable ? formattedInputData.slotDistributionInput : undefined,
      },
    }).then((res) => {
      if (res.data?.createEvent) {
        setEventData(DEFAULTINPUT);
        setOpenCreateSnackbar(true);
        router.push("/events");
      }
    });
  };

  return (
    <>
      <Card className={classes.content}>
        <Box textAlign="center">
          <Typography variant="h2">Opprett nytt arrangement</Typography>
        </Box>
        <Box paddingTop={3}>
          <Typography variant="h4">Påkrevde felt</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              label="Tittel"
              placeholder="Tittel"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.currentTarget.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Starttid</InputLabel>
            <TextField
              type="datetime-local"
              value={eventData.startTime}
              onChange={(e) => setEventData({ ...eventData, startTime: e.currentTarget.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Beskrivelse"
              multiline
              rows={3}
              required
              placeholder="Beskrivelse ..."
              variant="outlined"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.currentTarget.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel id="select-org-label">Organisasjon</InputLabel>
              <Select
                labelId="select-org-label"
                id="select-org"
                name="organization"
                value={eventData.organizationId}
                onChange={(e) => setEventData({ ...eventData, organizationId: e.target.value })}
                disabled={userData.user.organizations.length < 2}
              >
                {userData.user.organizations.map((organization) => (
                  <MenuItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{ paddingBottom: 0, marginBottom: -10 }}>
            <Typography variant="h4">Frivillige felt</Typography>
          </Grid>

          <Grid item xs={12}>
            <Accordion expanded={isAttendable} onChange={() => onIsAttendableChange(!isAttendable)}>
              <AccordionSummary style={{ paddingLeft: 0, marginLeft: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAttendable}
                      onChange={(e) => onIsAttendableChange(e.currentTarget.checked)}
                      name="isAttendable"
                      color="primary"
                      disableRipple
                    />
                  }
                  label="Krever påmelding"
                />
              </AccordionSummary>
              <AccordionDetails style={{ paddingLeft: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <InputLabel>Påmelding åpner</InputLabel>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <TextField
                        type="datetime-local"
                        value={eventData.signupOpenDate}
                        onChange={(e) => setEventData({ ...eventData, signupOpenDate: e.currentTarget.value })}
                        disabled={!isAttendable}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel>Påmeldingsfrist</InputLabel>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <TextField
                        type="datetime-local"
                        value={eventData.deadline}
                        onChange={(e) => setEventData({ ...eventData, deadline: e.currentTarget.value })}
                        disabled={!isAttendable}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel>Pris</InputLabel>
                    <Tooltip title="Kommer snart!">
                      <TextField
                        type="number"
                        // value={eventData.price}
                        // onChange={(e) => setEventData({ ...eventData, price: e.currentTarget.value })}
                        margin={"dense"}
                        disabled
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel>Antall plasser</InputLabel>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <TextField
                        type="number"
                        value={eventData.availableSlots}
                        onChange={(e) => setEventData({ ...eventData, availableSlots: e.currentTarget.value })}
                        disabled={!isAttendable}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={eventData.bindingSignup}
                            onChange={(e) => setEventData({ ...eventData, bindingSignup: e.currentTarget.checked })}
                            name="bindingSignup"
                            color="primary"
                            disableRipple
                          />
                        }
                        disabled={!isAttendable}
                        label="Bindende påmelding"
                      />
                    </Tooltip>
                    <FormHelperText>Gjør det umulig å melde seg av (kan fortsatt melde av venteliste)</FormHelperText>
                  </Grid>
                  <Grid item xs={6}>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={eventData.hasExtraInformation}
                            onChange={(e) =>
                              setEventData({ ...eventData, hasExtraInformation: e.currentTarget.checked })
                            }
                            name="hasExtraInformation"
                            color="primary"
                            disableRipple
                          />
                        }
                        disabled={!isAttendable}
                        label="Utfylling av ekstrainformasjon"
                      />
                    </Tooltip>
                    <FormHelperText>Krev utfylling av en boks med ekstrainformasjon for påmelding</FormHelperText>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion
              expanded={hasSlotDistribution}
              onClick={() => setHasSlotDistribution(hasSlotDistribution)}
              onChange={() => setHasSlotDistribution(!hasSlotDistribution)}
            >
              <AccordionSummary style={{ padding: 0, margin: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-grade-years-label" shrink>
                        Åpent for
                      </InputLabel>
                      <Select
                        labelId="select-grade-years-label"
                        id="select-grade-years"
                        name="grade-years"
                        value={eventData.allowedGradeYears}
                        multiple
                        onChange={(e) => {
                          setEventData({ ...eventData, allowedGradeYears: e.target.value });
                        }}
                        displayEmpty
                      >
                        {[1, 2, 3, 4, 5].map((year: number) => (
                          <MenuItem key={year} value={year}>
                            {`${year}. klasse`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Tooltip
                      disableHoverListener={isAttendable}
                      disableFocusListener={isAttendable}
                      title="Kun aktuelt ved påmelding"
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={hasSlotDistribution}
                            onChange={(e) => setHasSlotDistribution(e.currentTarget.checked)}
                            name="slotDistribution"
                            color="primary"
                            disableRipple
                          />
                        }
                        disabled={!isAttendable}
                        label="Bestemt plassfordeling"
                      />
                    </Tooltip>
                    <FormHelperText>Sett av et bestemt antall plasser for ulike klassetrinn</FormHelperText>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <SlotDistribution
                  slotDistribution={slotDistribution}
                  onUpdateSlotDistribution={updateSlotDistribution}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Kontakt-epost"
              placeholder="ola.nordmann@gmail.com"
              value={eventData.contactEmail}
              onChange={(e) => setEventData({ ...eventData, contactEmail: e.currentTarget.value })}
            />
            <FormHelperText>E-postadresse for kontakt angående arrangementet</FormHelperText>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Sluttid for arrangement</InputLabel>
            <TextField
              type="datetime-local"
              value={eventData.endTime}
              onChange={(e) => setEventData({ ...eventData, endTime: e.currentTarget.value })}
              margin={"dense"}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Kort beskrivelse"
              placeholder="Beskrivelse"
              value={eventData.shortDescription}
              onChange={(e) => setEventData({ ...eventData, shortDescription: e.currentTarget.value })}
            />
            <FormHelperText>Beskrivelsen blir vist i listen av arrangementer</FormHelperText>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <InputLabel id="select-category-label" shrink>
                Kategori
              </InputLabel>
              <Select
                labelId="select-category-label"
                id="select-category"
                name="category"
                value={eventData.categoryId}
                onChange={(e) => {
                  setEventData({ ...eventData, categoryId: e.target.value as string });
                }}
                displayEmpty
              >
                <MenuItem value="">{"Ingen Kategori"}</MenuItem>
                {categoryData.allCategories.map((category: Category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Lokasjon"
              placeholder="Lokasjon"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.currentTarget.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <Tooltip title="Kommer snart!">
              <TextField
                label="Bilde (URL)"
                placeholder="Bilde URL"
                value={eventData.image}
                onChange={(e) => setEventData({ ...eventData, image: e.currentTarget.value })}
                disabled
              />
            </Tooltip>
            <FormHelperText>Bildet vil bli vist på infosiden til eventet</FormHelperText>
          </Grid>

          <Grid item xs={7}>
            {createEventLoading && <CircularProgress />}
          </Grid>
        </Grid>
        <CardActions>
          <Button onClick={() => onSubmit()} color="primary" variant="contained">
            <Typography>Opprett arrangement</Typography>
          </Button>
        </CardActions>
      </Card>

      <Alert
        severity="error"
        open={openCreateErrorSnackbar}
        onClose={() => {
          setOpenCreateErrorSnackbar(false);
          setErrors([]);
        }}
        description={
          createEventError
            ? createEventError.message
            : "Opprettelse feilet: ".concat(
                errors.slice(1, errors.length).reduce((res, error) => `${res}, ${error}`, `${errors[0]}`)
              )
        }
      />

      <Alert
        severity="success"
        open={openCreateSnackbar}
        onClose={() => setOpenCreateSnackbar(false)}
        description={"Arrangement opprettet"}
      />
    </>
  );
};

export default CreateEvent;
