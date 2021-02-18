import { useMutation, useQuery } from "@apollo/client";
import { getRangeLength } from "@components/Calendar";
import Layout from "@components/Layout";
import CardC from "@components/pages/cabins/CardC";
import CheckBox from "@components/pages/cabins/InputFields/Checkbox";
import { InputFields } from "@components/pages/cabins/InputFields/InputFields";
import ImageSlider from "@components/pages/cabins/ImageSlider/ImageSlider";
import PriceSummary from "@components/pages/cabins/Summary/PriceSummary";
import Summary from "@components/pages/cabins/Summary/Summary";
import { GET_USER } from "@graphql/auth/queries";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { BookingData, Cabin, ContractProps, InputFieldsEvent, InputValueTypes, Validations } from "@interfaces/cabins";
import { User } from "@interfaces/users";
import { Box, Button, Container, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CREATE_CABIN } from "../../graphql/cabins/mutations";
import useBookingRange from "../../hooks/cabins/useBookingRange";
import HeaderComposition from "@components/pages/cabins/HeaderComposition";
import { allValuesDefined, validateInputForm } from "@utils/helpers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

const BookPage: NextPage = () => {
  const defaultPriceIndoker = 1100;
  const defaultPriceExternal = 2700;

  const temporarilyDisableSubmitting = false;
  const temporarilyDisableBooking = false;

  const router = useRouter();
  const urlData = router.query;

  // default 0 for numberIndok and numberExternal
  const [inputValues, setInputValues] = useState<InputValueTypes>({
    numberIndok: 0,
    numberExternal: 0,
    phone: "",
    receiverEmail: "",
    firstname: "",
    surname: "",
  });
  const [bookingData, setBookingData] = useState({ numberExternal: 0, numberIndok: 0 } as BookingData);
  const [pricePerNight, setPricePerNight] = useState(defaultPriceIndoker);
  const [contractData, setContractData] = useState({} as ContractProps);
  const [rangeLength, setRangeLength] = useState(0);
  const [createBooking] = useMutation(CREATE_CABIN);
  const [sendEmail] = useMutation(SEND_EMAIL);
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkerror, setCheckError] = useState("");
  const [checkable, setCheckable] = useState(false);
  const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [cabinIds, setCabinIDs] = useState<number[]>();
  const { data } = useQuery<{ user: User }>(GET_USER);
  const [userData, setUserData] = useState<User>();
  const [validations, setValidations] = useState<Validations>();
  const [isInputValidated, setIsInputValidated] = useState(false);

  const handleCheckboxClick = (isChecked: boolean) => {
    setChecked(isChecked);
    setCheckError("");
  };

  useEffect(() => {
    // exclude triggerError when validating inputs
    if (validations) {
      const { triggerError, ...evaluated } = validations;
      setIsInputValidated(Object.values(evaluated).every((val) => val));
    }
  }, [validations]);

  useEffect(() => {
    // update user data and inputvalues data to automatically fill in input fields
    if (data) {
      setUserData(data.user);

      const updatedInputValues = {
        ...inputValues,
        firstname: data.user.firstName,
        surname: data.user.lastName,
        receiverEmail: data.user.email,
      };

      setInputValues(updatedInputValues);
      setBookingData({ ...bookingData, ...updatedInputValues });
    }
  }, [data]);

  useEffect(() => {
    // update validations on input change
    if (allValuesDefined(inputValues) && Object.values(inputValues).length > 2) {
      setValidations(validateInputForm(inputValues));
    }
  }, [inputValues]);

  useEffect(() => {
    if (cabinIds && cabinQuery.data) {
      setBookingData({
        ...bookingData,
        cabins: cabinQuery.data.cabins
          .filter((cabin) => cabinIds.includes(parseInt(cabin.id)))
          .map((cabin) => cabin.name) as string[],
      });
    }
  }, [cabinQuery.data, cabinIds]);

  useEffect(() => {
    if (urlData.fromDate && urlData.toDate && urlData.cabins) {
      const fromDate = urlData.fromDate as string;
      const fromDateParsed = fromDate.split("/").reverse().join("-");
      const toDate = urlData.toDate as string;
      const toDateParsed = toDate.split("/").reverse().join("-");
      setRange(fromDateParsed, toDateParsed);
      setRangeLength(getRangeLength(fromDate, toDate));
      setCabinIDs((urlData.cabins as string).split("_").map((id) => parseInt(id)));
    }
  }, [urlData]);

  useEffect(() => {
    setErrorMessage(isAvailable ? "" : "Den valgte perioden er ikke tilgjengelig.");
  }, [isAvailable]);

  const handleInputChange = (name: string, event: InputFieldsEvent) => {
    // update input data
    const updatedInput = { ...inputValues, [name]: event.target.value };

    setValidations(validateInputForm(updatedInput));
    setInputValues(updatedInput);
    setPricePerNight(
      updatedInput.numberIndok >= updatedInput.numberExternal ? defaultPriceIndoker : defaultPriceExternal
    );

    // update checklist and checkable
    const checklist = Object.values(updatedInput).filter((value) => {
      if (value != null) {
        return 1;
      }
    });

    setCheckable(checklist.length == 6 ? true : false);

    // update bookingData with updated input data
    const updatedBookingData: BookingData = {
      ...updatedInput,
      ...{
        bookFrom: range.fromDate as string,
        bookTo: range.toDate as string,
        cabins: bookingData.cabins,
        price: rangeLength * pricePerNight,
      },
    };
    setBookingData(updatedBookingData);

    // update contract data state
    const updatedContractData = {
      firstname: updatedBookingData.firstname,
      surname: updatedBookingData.surname,
      fromDate: updatedBookingData.bookFrom,
      toDate: updatedBookingData.bookTo,
      cabins: updatedBookingData.cabins,
      price: updatedBookingData.price,
    };
    setContractData({ contractData: updatedContractData });
  };

  const handleSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    if (temporarilyDisableSubmitting) {
      return;
    }

    // trigger possible error messages
    if (validations) {
      setValidations({ ...validations, triggerError: true });
    }

    // create booking and send email, redirect to confirmation page
    if (checked && isAvailable && isInputValidated) {
      // only create booking and send mail if allowed
      if (!temporarilyDisableBooking) {
        createBooking({
          // switch cabin names with cabin IDs
          variables: { ...bookingData, cabins: cabinIds },
        });

        sendEmail({
          variables: bookingData,
        });
      }

      router.push({ pathname: "./confirmation" });

      setErrorMessage("");
      setCheckError("");
    } else {
      setErrorMessage(isAvailable ? "" : "Den valgte perioden er ikke tilgjengelig.");
      setCheckError(checked ? "" : "Du må samtykke med retningslinjene før du booker.");
    }
  };

  const classes = useStyles();

  return (
    <>
      <Layout>
        <Container>
          <HeaderComposition headerText="Fullføring av booking" href={"/cabins"} />
          {isAvailable ? (
            <Box className={classes.root}>
              <Grid container spacing={2} direction={"row"}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3} direction={"column"}>
                    <Grid item>
                      <Summary
                        from={range.fromDate ? range.fromDate : ""}
                        to={range.toDate ? range.toDate : ""}
                        cabins={bookingData.cabins ? bookingData.cabins : [""]}
                        price={pricePerNight}
                        nights={rangeLength}
                      />
                    </Grid>

                    <Grid item>
                      <Container>
                        <CardC>
                          <Grid item>
                            <InputFields
                              userData={userData}
                              onChange={handleInputChange}
                              cabins={bookingData.cabins}
                              numberIndok={bookingData.numberIndok}
                              numberExternal={bookingData.numberExternal}
                              validations={validations}
                            />
                          </Grid>
                          <Grid item>
                            <Grid container spacing={3}>
                              <Grid item>
                                <CheckBox
                                  onClick={handleCheckboxClick}
                                  errorMsg={checkerror}
                                  checkable={checkable}
                                  contractData={contractData}
                                />
                              </Grid>
                              <Grid item>
                                <Button
                                  color="primary"
                                  onClick={(e) => handleSubmit(e)}
                                  disabled={temporarilyDisableSubmitting}
                                  variant="contained"
                                  size="large"
                                >
                                  Gå til betaling
                                </Button>
                              </Grid>
                              <Grid item>
                                <Typography>OBS: Det er dessverre ikke mulig å booke via nettsiden ennå.</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardC>
                      </Container>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container spacing={3} direction={"column"}>
                    <Grid item>
                      <ImageSlider cabins={bookingData.cabins} />
                    </Grid>
                    <Grid item>
                      <PriceSummary
                        numberIndok={bookingData.numberIndok}
                        numberExternal={bookingData.numberExternal}
                        pricePerNight={pricePerNight}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>{allBookingsQuery.loading ? <p>Laster...</p> : <p>{errorMessage}</p>}</>
          )}
        </Container>
      </Layout>
    </>
  );
};

export default BookPage;
