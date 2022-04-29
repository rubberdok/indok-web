import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_EVENT } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT, GET_CATEGORIES, GET_EVENT } from "@graphql/events/queries";
import { Category, Event } from "@interfaces/events";
import {
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
} from "@mui/material";
import { Check, Close, Warning } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(nb);
dayjs.tz.setDefault("Europe/Oslo");
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

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
    categoryId: "",
    image: "",
    isAttendable: false,
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

    if (event.signupOpenDate) {
      initialEventData.signupOpenDate = dayjs(event.signupOpenDate).format(DATE_FORMAT);
    }
    if (event.deadline) {
      initialEventData.deadline = dayjs(event.deadline).format(DATE_FORMAT);
    }
    if (event.endTime) {
      initialEventData.endTime = dayjs(event.endTime).format(DATE_FORMAT);
    }
    setEventData(initialEventData);
  }, []);

  if (categoryLoading) return <CircularProgress />;
  if (categoryError) return <Typography>Det oppstod en feil.</Typography>;

  const onIsAttendableChange = (attendable: boolean) => {
    // Reset all fields depending on isAttendable if isAttendable is disabled
    if (attendable) {
      setEventData({ ...eventData, isAttendable: true });
    } else {
      setEventData({
        ...eventData,
        isAttendable: false,
        availableSlots: "",
        bindingSignup: false,
        hasExtraInformation: false,
        signupOpenDate: "",
        deadline: "",
        allowedGradeYears: [1, 2, 3, 4, 5],
      });
    }
  };

  const onSubmit = () => {
    const input = { ...eventData };
    Object.keys(eventData).forEach((key) => {
      if (eventData[key] === "") {
        input[key] = undefined;
      }
    });
    updateEvent({ variables: { id: event.id, eventData: input } });
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Rediger arrangement</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Warning />
          Vær varsom ved endring av arrangementer etter påmelding har åpnet.
        </DialogContentText>
        <Typography variant="h4">Påkrevde felt</Typography>
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
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={eventData.isAttendable}
                  onChange={(e) => onIsAttendableChange(e.currentTarget.checked)}
                  name="isAttendable"
                  color="primary"
                  disableRipple
                />
              }
              label="Krever påmelding"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Frivillige felt</Typography>
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
            <InputLabel>Antall plasser</InputLabel>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
              title="Kun aktuelt ved påmelding"
            >
              <TextField
                type="number"
                value={eventData.availableSlots}
                onChange={(e) => setEventData({ ...eventData, availableSlots: e.currentTarget.value })}
                disabled={!eventData.isAttendable}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
              title="Kun aktuelt ved påmelding"
            >
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
                  disabled={!eventData.isAttendable}
                >
                  {[1, 2, 3, 4, 5].map((year: number) => (
                    <MenuItem key={year} value={year}>
                      {`${year}. klasse`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
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
                  setEventData({ ...eventData, categoryId: e.target.value });
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
          <Grid item xs={12}>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
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
                disabled={!eventData.isAttendable}
                label="Bindende påmelding"
              />
            </Tooltip>
            <FormHelperText>Gjør det umulig å melde seg av (kan fortsatt melde av venteliste)</FormHelperText>
          </Grid>
          <Grid item xs={12}>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
              title="Kun aktuelt ved påmelding"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventData.hasExtraInformation}
                    onChange={(e) => setEventData({ ...eventData, hasExtraInformation: e.currentTarget.checked })}
                    name="hasExtraInformation"
                    color="primary"
                    disableRipple
                  />
                }
                disabled={!eventData.isAttendable}
                label="Utfylling av ekstrainformasjon"
              />
            </Tooltip>
            <FormHelperText>Krev utfylling av en boks med ekstrainformasjon for påmelding</FormHelperText>
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Påmelding åpner</InputLabel>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
              title="Kun aktuelt ved påmelding"
            >
              <TextField
                type="datetime-local"
                value={eventData.signupOpenDate}
                onChange={(e) => setEventData({ ...eventData, signupOpenDate: e.currentTarget.value })}
                disabled={!eventData.isAttendable}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Deadline for påmelding</InputLabel>
            <Tooltip
              disableHoverListener={eventData.isAttendable}
              disableFocusListener={eventData.isAttendable}
              title="Kun aktuelt ved påmelding"
            >
              <TextField
                type="datetime-local"
                value={eventData.deadline}
                onChange={(e) => setEventData({ ...eventData, deadline: e.currentTarget.value })}
                disabled={!eventData.isAttendable}
              />
            </Tooltip>
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
            <InputLabel>Pris</InputLabel>
            <Tooltip title="Kommer snart!">
              <TextField
                type="number"
                value={eventData.price}
                onChange={(e) => setEventData({ ...eventData, price: e.currentTarget.value })}
                margin={"dense"}
                disabled
              />
            </Tooltip>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {updateEventError && <Typography color="error">Feil: {updateEventError.message}</Typography>}
        {updateEventLoading && <CircularProgress />}
        <Button onClick={() => onClose()} color="primary" startIcon={<Close />}>
          Avbryt
        </Button>
        <Button onClick={() => onSubmit()} color="primary" startIcon={<Check />}>
          Lagre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEvent;
