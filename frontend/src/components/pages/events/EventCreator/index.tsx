import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_EVENT } from "@graphql/events/mutations";
import { GET_CATEGORIES } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Button, Card, CardActions, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Alert from "@components/Alert";
import { DEFAULTINPUT } from "../constants";
import { getFormattedDataAndErrors } from "../helpers";
import RequiredFields from "../EventFields/RequiredFields";
import AttendableFields from "../EventFields/AttendableFields";
import SlotDistributionFields from "../EventFields/SlotDistributionFields";
import OptionalFields from "../EventFields/OptionalFields";

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
    const usedGrades = ([] as number[])
      .concat(...newSlotDistribution.map((dist) => dist.category))
      .sort((a, b) => a - b);
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
    const formattedInputData = getFormattedDataAndErrors(
      eventData,
      isAttendable,
      hasSlotDistribution,
      slotDistribution
    );

    if (formattedInputData.currentErrors.length > 0) {
      setErrors(formattedInputData.currentErrors);
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

        <Grid container spacing={3}>
          <RequiredFields eventData={eventData} user={userData.user} onEventDataChange={setEventData} />

          <AttendableFields
            eventData={eventData}
            onEventDataChange={setEventData}
            isAttendable={isAttendable}
            onIsAttendableChange={onIsAttendableChange}
          />

          <SlotDistributionFields
            eventData={eventData}
            onEventDataChange={setEventData}
            isAttendable={isAttendable}
            hasSlotDistribution={hasSlotDistribution}
            onHasSlotDistributionChange={setHasSlotDistribution}
            onUpdateSlotDistribution={updateSlotDistribution}
            slotDistribution={slotDistribution}
          />

          <OptionalFields
            eventData={eventData}
            onEventDataChange={setEventData}
            allCategories={categoryData.allCategories}
          />

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
        description={createEventError ? createEventError.message : "Opprettelse feilet: ".concat(`${errors[0]}`)}
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
