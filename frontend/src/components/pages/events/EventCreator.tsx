import { gql, useMutation, useQuery } from "@apollo/client";
import {
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
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import {
  AllCategoriesDocument,
  CreateEventDocument,
  CreateEventInput,
  EventInListFragment,
  UserWithEventsAndOrgsDocument,
} from "@/generated/graphql";

/** Component for the creating a new event. */
const CreateEvent: React.FC = () => {
  const defaultInput: CreateEventInput = {
    title: "",
    description: "",
    startTime: "",
    endTime: undefined,
    location: undefined,
    organizationId: "",
    categoryId: undefined,
    image: undefined,
    isAttendable: false,
    deadline: undefined,
    signupOpenDate: undefined,
    availableSlots: undefined,
    // price: undefined,
    shortDescription: undefined,
    hasExtraInformation: false,
    contactEmail: undefined,
    bindingSignup: false,
    allowedGradeYears: [1, 2, 3, 4, 5],
  };

  const [eventData, setEventData] = useState(defaultInput);

  const router = useRouter();

  const [createEvent, { loading: createEventLoading, error: createEventError }] = useMutation(CreateEventDocument, {
    update: (cache, { data }) => {
      data?.createEvent?.event &&
        cache.modify({
          fields: {
            allEvents: (existingEvents) => {
              if (!data?.createEvent?.event) return existingEvents;

              const newEventRef = cache.writeFragment<EventInListFragment>({
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

  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(AllCategoriesDocument);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(UserWithEventsAndOrgsDocument, {
    onCompleted: ({ user }) => {
      if (!eventData.organizationId) {
        setEventData((prevData) => ({ ...prevData, organizationId: user?.organizations[0]?.id ?? "" }));
      }
    },
  });

  if (categoryLoading || userLoading) return <CircularProgress />;
  if (categoryError || userError) return <Typography>Det oppstod en feil.</Typography>;

  if (!userData || !userData.user || !userData.user.organizations.length) {
    router.push("/events");
    return null;
  }

  const onIsAttendableChange = (attendable: boolean) => {
    // Reset all fields depending on isAttendable if isAttendable is disabled
    if (attendable) {
      setEventData({ ...eventData, isAttendable: true });
    } else {
      setEventData({
        ...eventData,
        isAttendable: false,
        availableSlots: undefined,
        bindingSignup: false,
        hasExtraInformation: false,
        signupOpenDate: "",
        deadline: "",
        allowedGradeYears: [1, 2, 3, 4, 5],
      });
    }
  };

  const onSubmit = () => {
    createEvent({ variables: { eventData: eventData } }).then((res) => {
      if (res.data?.createEvent) {
        setEventData(defaultInput);
        router.push("/events");
      }
    });
  };

  return (
    <Card sx={{ padding: (theme) => theme.spacing(5), width: "50%", margin: "0 auto" }}>
      <Box marginTop="-10" marginBottom="10" textAlign="center">
        <Typography variant="h2">Opprett nytt arrangement</Typography>
      </Box>
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
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="select-org-label">Forening</InputLabel>
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
              onChange={(e) => setEventData({ ...eventData, availableSlots: parseInt(e.currentTarget.value) })}
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
                  const allowedGradeYears = typeof e.target.value === "string" ? undefined : e.target.value;
                  setEventData({ ...eventData, allowedGradeYears });
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
                setEventData({ ...eventData, categoryId: e.target.value as string });
              }}
              displayEmpty
            >
              <MenuItem value="">{"Ingen Kategori"}</MenuItem>
              {categoryData?.allCategories?.map((category) => (
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
                  checked={eventData.bindingSignup ?? false}
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
                  checked={eventData.hasExtraInformation ?? false}
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
              // value={eventData.price}
              // onChange={(e) => setEventData({ ...eventData, price: e.currentTarget.value })}
              margin={"dense"}
              disabled
            />
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          {createEventLoading && <CircularProgress />}
          {createEventError && <Typography color="error">Feil: {createEventError.message}</Typography>}
        </Grid>
      </Grid>
      <CardActions>
        <Button onClick={() => onSubmit()} color="primary">
          Opprett arrangement
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreateEvent;
