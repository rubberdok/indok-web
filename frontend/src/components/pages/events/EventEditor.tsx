import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_EVENT } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT, GET_CATEGORIES, GET_EVENT } from "@graphql/events/queries";
import { Category, Event } from "@interfaces/events";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Check, Close, Warning } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SlotDistribution from "./SlotDistribution";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(nb);
dayjs.tz.setDefault("Europe/Oslo");
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";
import Alert from "../../Alert";

interface EditEventProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

/**
 * Component (Dialog) for editing an event
 *
 * Props:
 * - open: whether the dialog should be open
 * - onClose: called when the doalog should be closed
 * - event: The event to be edited
 */

const EditEvent: React.FC<EditEventProps> = ({ open, onClose, event }) => {
  const defaultInput: Record<string, any> = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    organizationId: "",
    categoryId: "",
    image: "",
    deadline: "",
    signupOpenDate: "",
    availableSlots: "",
    price: undefined,
    shortDescription: "",
    hasExtraInformation: false,
    contactEmail: "",
    bindingSignup: false,
    allowedGradeYears: [1, 2, 3, 4, 5],
  };

  const [eventData, setEventData] = useState(defaultInput);
  const [isAttendable, setIsAttendable] = useState(!!event.attendable);
  const [hasSlotDistribution, setHasSlotDistribution] = useState(
    event?.availableSlots !== undefined && event?.availableSlots?.length > 1
  );
  const [slotDistribution, setSlotDistribution] = useState<{ category: number[]; availableSlots: number }[]>(
    event.availableSlots && event.availableSlots?.length > 1
      ? event.availableSlots.map((dist) => {
          return { category: dist.category.split(",").map((val) => Number(val)), availableSlots: dist.availableSlots };
        })
      : []
  );
  const [totalAvailableSlots, setTotalAvailableSlots] = useState(
    event.availableSlots ? event.availableSlots.reduce((res, dist) => (res = res + dist.availableSlots), 0) : undefined
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [openEditErrorSnackbar, setOpenEditErrorSnackbar] = useState(false);
  const [openEditSnackbar, setOpenEditSnackbar] = useState(false);

  const [updateEvent, { loading: updateEventLoading, error: updateEventError }] = useMutation<{
    updateEvent: { event: Event };
  }>(UPDATE_EVENT, {
    update: (cache, { data }) => {
      data &&
        cache.writeQuery<Event>({ query: GET_EVENT, data: data.updateEvent.event }) &&
        cache.writeQuery<Event>({ query: ADMIN_GET_EVENT, data: { ...event, ...data.updateEvent.event } });
    },
  });

  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    // Used to get an initial event data object, keeping all fields except for the date related ones
    // equal to the event we get from the event prop (the date fields are changed to make TS happy)

    const initialEventData = {
      ...eventData,
    };

    Object.keys(defaultInput).forEach((key) => {
      if (key in eventData && !!(event as Record<string, any>)[key]) {
        initialEventData[key] = (event as Record<string, any>)[key];
      }
    });
    initialEventData.categoryId = event.category ? event.category.id : "";

    initialEventData.startTime = dayjs(event.startTime).format(DATE_FORMAT);

    initialEventData.availableSlots =
      slotDistribution.length > 0
        ? slotDistribution.reduce((res, dist) => (res = res + dist.availableSlots), 0)
        : undefined;

    if (event?.attendable?.signupOpenDate) {
      initialEventData.signupOpenDate = dayjs(event?.attendable?.signupOpenDate).format(DATE_FORMAT);
    }
    if (event?.attendable?.deadline) {
      initialEventData.deadline = dayjs(event?.attendable?.deadline).format(DATE_FORMAT);
    }
    if (event.endTime) {
      initialEventData.endTime = dayjs(event.endTime).format(DATE_FORMAT);
    }
    setEventData(initialEventData);
  }, []);

  if (categoryLoading) return <CircularProgress />;
  if (categoryError) return <Typography>Det oppstod en feil.</Typography>;

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
    let currentErrors: string[] = [];

    const eventInputData = {
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.startTime,
      organizationId: eventData.organizationId,
      endTime: eventData.endTime,
      location: eventData.location,
      categoryId: eventData.categoryId,
      image: eventData.image,
      shortDescription: eventData.shortDescription,
      contactEmail: eventData.contactEmail,
      allowedGradeYears: eventData.allowedGradeYears,
      hasExtraInformation: eventData.hasExtraInformation,
    };
    const eventInput = { ...eventInputData };

    Object.keys(eventInputData).forEach((key) => {
      if (eventInputData[key] === "") {
        eventInput[key] = undefined;
      }
    });

    if (!eventInput.title || !eventInput.description || !eventInput.startTime) {
      currentErrors = [...errors, "Tittel, beskrivelse og starttid er påkrevd"];
    }

    const attendableInputData = {
      signupOpenDate: eventData.signupOpenDate,
      bindingSignup: eventData.bindingSignup,
      deadline: eventData.deadline,
    }; // add price: eventData.price here
    const attendableInput = { ...attendableInputData };

    Object.keys(attendableInputData).forEach((key) => {
      if (attendableInputData[key] === "") {
        attendableInput[key] = undefined;
      }
    });

    if (isAttendable && !attendableInput.signupOpenDate) {
      currentErrors = [...errors, "Når påmeldingen åpner er påkrevd for arrangementer med påmelding"];
    }

    if (
      isAttendable &&
      hasSlotDistribution &&
      slotDistribution.reduce((res, dist) => (res = res + dist.availableSlots), 0) !== totalAvailableSlots
    ) {
      currentErrors = [...errors, "Totalt antall plasser må stemme med antall i hver gruppe i plassfordelingen"];
    }

    const stringSlotDistribution = slotDistribution.map((dist) => {
      const stringCategory = dist.category.reduce((res, grade) => `${res},${grade}`, "");
      return { category: stringCategory.slice(1, stringCategory.length), availableSlots: dist.availableSlots };
    });

    const slotDistributionInputData = { availableSlots: totalAvailableSlots, gradeYears: stringSlotDistribution };
    const slotDistributionInput = { ...slotDistributionInputData };

    Object.keys(slotDistributionInputData).forEach((key) => {
      if (slotDistributionInputData[key] === "") {
        slotDistributionInput[key] = undefined;
      }
    });

    if (isAttendable && !slotDistributionInput.availableSlots) {
      currentErrors = [...errors, "Antall plasser er påkrevd for arrangementer med påmelding"];
    }

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setOpenEditErrorSnackbar(true);
      return;
    }

    updateEvent({
      variables: {
        id: event.id,
        isAttendable,
        hasGradeDistributions: hasSlotDistribution,
        eventData: eventInput,
        attendableData: isAttendable ? attendableInput : undefined,
        slotDistributionData: isAttendable ? slotDistributionInput : undefined,
      },
    }).then((res) => {
      if (res.data?.updateEvent) {
        setOpenEditSnackbar(true);
      }
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>
        <Typography variant="h4">Rediger arrangement</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}>
              <Warning />
            </Grid>
            <Grid item xs={11}>
              Vær varsom ved endring av arrangementer etter påmelding har åpnet.
            </Grid>
          </Grid>
        </DialogContentText>
        <Box paddingBottom={1} paddingTop={1}>
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
                        value={totalAvailableSlots}
                        onChange={(e) => setTotalAvailableSlots(Number(e.currentTarget.value))}
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
              onChange={() => {
                setHasSlotDistribution(!hasSlotDistribution);
                if (hasSlotDistribution) {
                  setSlotDistribution([]);
                }
              }}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        {updateEventError && <Typography color="error">Feil: {updateEventError.message}</Typography>}
        {updateEventLoading && <CircularProgress />}
        {errors.length > 0 &&
          errors.map((error) => (
            <Typography key={error} color="error">
              {error}
            </Typography>
          ))}
        <Button onClick={() => onClose()} color="primary" startIcon={<Close />}>
          Avbryt
        </Button>
        <Button onClick={() => onSubmit()} color="primary" startIcon={<Check />}>
          Lagre
        </Button>
      </DialogActions>
      <Alert
        severity="error"
        open={openEditErrorSnackbar}
        onClose={() => {
          setOpenEditErrorSnackbar(false);
          setErrors([]);
        }}
        description={
          updateEventError
            ? updateEventError.message
            : "Opprettelse feilet: ".concat(
                errors.slice(1, errors.length).reduce((res, error) => `${res}, ${error}`, `${errors[0]}`)
              )
        }
      />

      <Alert
        severity="success"
        open={openEditSnackbar}
        onClose={() => setOpenEditSnackbar(false)}
        description={"Arrangement oppdatert"}
      />
    </Dialog>
  );
};

export default EditEvent;
