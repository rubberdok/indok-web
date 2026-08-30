import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Container, Divider, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { AreaSettings, BookingRulesSettings, SemesterSettings } from "@/components/pages/janhus/admin";
import type { AreaForm, SettingsForm } from "@/components/pages/janhus/constants";
import { Title } from "@/components/Title";
import {
  JanHusAreasDocument,
  JanHusBookingSettingsDocument,
  UpdateJanhusAreaDocument,
  UpdateJanhusBookingSettingsDocument,
} from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date: string) {
  return dayjs(date).tz("Europe/Oslo").format(DATE_FORMAT);
}

const JanHusSettingsPage: NextPageWithLayout = () => {
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  const { data: settingsData, refetch: refetchSettings } = useQuery(JanHusBookingSettingsDocument);
  const { data: areaData, refetch: refetchAreas } = useQuery(JanHusAreasDocument, {
    variables: { includeInactive: true },
  });

  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    minDurationMinutes: 60,
    slotGranularityMinutes: 30,
    openingHour: 8,
    closingHour: 2,
    bufferMinutes: 0,
    organizationBookingOpensWeeksBefore: 6,
    generalBookingOpensWeeksBefore: 4,
    fallStartDate: formatDate(new Date().toISOString()),
    fallEndDate: formatDate(new Date().toISOString()),
    springStartDate: formatDate(new Date().toISOString()),
    springEndDate: formatDate(new Date().toISOString()),
    fallSemesterActive: true,
    springSemesterActive: true,
    externalBookingsEnabled: true,
    privateBookingsEnabled: true,
    cleaningOptionEnabled: true,
  });

  const [areaForms, setAreaForms] = useState<Record<string, AreaForm>>({});

  const openingHourOptions = useMemo(() => {
    const slotGranularityMinutes = Math.max(settingsForm.slotGranularityMinutes, 1);
    const values: number[] = [];

    for (let minutes = 0; minutes < 24 * 60; minutes += slotGranularityMinutes) {
      if (minutes % 60 === 0) {
        values.push(minutes / 60);
      }
    }

    if (!values.includes(settingsForm.openingHour)) {
      values.push(settingsForm.openingHour);
    }

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [settingsForm.openingHour, settingsForm.slotGranularityMinutes]);

  const closingHourOptions = useMemo(() => {
    const slotGranularityMinutes = Math.max(settingsForm.slotGranularityMinutes, 1);
    const options: Array<{ value: number; label: string }> = [];

    for (let offset = slotGranularityMinutes; offset <= 24 * 60; offset += slotGranularityMinutes) {
      const minutesFromMidnight = settingsForm.openingHour * 60 + offset;
      if (minutesFromMidnight % 60 !== 0) {
        continue;
      }

      const value = Math.floor(minutesFromMidnight / 60) % 24;
      const dayOffset = Math.floor(minutesFromMidnight / (24 * 60));
      const label = `${value.toString().padStart(2, "0")}:00${dayOffset > 0 ? " (+1 dag)" : ""}`;

      if (!options.some((option) => option.value === value)) {
        options.push({ value, label });
      }
    }

    if (!options.some((option) => option.value === settingsForm.closingHour)) {
      const wrapsToNextDay = settingsForm.closingHour <= settingsForm.openingHour;
      options.push({
        value: settingsForm.closingHour,
        label: `${settingsForm.closingHour.toString().padStart(2, "0")}:00${wrapsToNextDay ? " (+1 dag)" : ""}`,
      });
    }

    return options;
  }, [settingsForm.closingHour, settingsForm.openingHour, settingsForm.slotGranularityMinutes]);

  useEffect(() => {
    const settings = settingsData?.janhusBookingSettings;
    if (!settings) return;

    setSettingsForm({
      minDurationMinutes: settings.minDurationMinutes,
      slotGranularityMinutes: settings.slotGranularityMinutes,
      openingHour: settings.openingHour,
      closingHour: settings.closingHour,
      bufferMinutes: settings.bufferMinutes,
      organizationBookingOpensWeeksBefore: settings.organizationBookingOpensWeeksBefore,
      generalBookingOpensWeeksBefore: settings.generalBookingOpensWeeksBefore,
      fallStartDate: formatDate(settings.fallStartDate),
      fallEndDate: formatDate(settings.fallEndDate),
      springStartDate: formatDate(settings.springStartDate),
      springEndDate: formatDate(settings.springEndDate),
      fallSemesterActive: settings.fallSemesterActive,
      springSemesterActive: settings.springSemesterActive,
      externalBookingsEnabled: settings.externalBookingsEnabled ?? true,
      privateBookingsEnabled: settings.privateBookingsEnabled ?? true,
      cleaningOptionEnabled: settings.cleaningOptionEnabled ?? true,
    });
  }, [settingsData]);

  useEffect(() => {
    const areas = areaData?.janhusAreas;
    if (!areas) return;

    setAreaForms(
      Object.fromEntries(
        areas.map((area) => [
          area.id,
          {
            internalPricePerHour: String(area.internalPricePerHour),
            externalPricePerHour: String(area.externalPricePerHour),
            cleaningFee: String(area.cleaningFee),
            defaultDepositAmount: String(area.defaultDepositAmount ?? 0),
          },
        ])
      )
    );
  }, [areaData]);

  const [updateSettings, { loading: settingsSaving }] = useMutation(UpdateJanhusBookingSettingsDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Innstillinger oppdatert" });
      await refetchSettings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [updateArea, { loading: areaSaving }] = useMutation(UpdateJanhusAreaDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Prisinnstillinger oppdatert" });
      await refetchAreas();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [archiveArea] = useMutation(UpdateJanhusAreaDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Område arkivert" });
      await refetchAreas();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [restoreArea] = useMutation(UpdateJanhusAreaDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Område gjenopprettet" });
      await refetchAreas();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  async function saveSettings() {
    await updateSettings({
      variables: {
        settingsData: {
          minDurationMinutes: settingsForm.minDurationMinutes,
          slotGranularityMinutes: settingsForm.slotGranularityMinutes,
          openingHour: settingsForm.openingHour,
          closingHour: settingsForm.closingHour,
          bufferMinutes: settingsForm.bufferMinutes,
          organizationBookingOpensWeeksBefore: settingsForm.organizationBookingOpensWeeksBefore,
          generalBookingOpensWeeksBefore: settingsForm.generalBookingOpensWeeksBefore,
          fallStartDate: settingsForm.fallStartDate,
          fallEndDate: settingsForm.fallEndDate,
          springStartDate: settingsForm.springStartDate,
          springEndDate: settingsForm.springEndDate,
          fallSemesterActive: settingsForm.fallSemesterActive,
          springSemesterActive: settingsForm.springSemesterActive,
          externalBookingsEnabled: settingsForm.externalBookingsEnabled,
          privateBookingsEnabled: settingsForm.privateBookingsEnabled,
          cleaningOptionEnabled: settingsForm.cleaningOptionEnabled,
        },
      },
    });
  }

  async function saveArea(id: string) {
    const form = areaForms[id];
    if (!form) return;

    await updateArea({
      variables: {
        areaData: {
          id,
          internalPricePerHour: Number(form.internalPricePerHour),
          externalPricePerHour: Number(form.externalPricePerHour),
          cleaningFee: Number(form.cleaningFee),
          defaultDepositAmount: Number(form.defaultDepositAmount),
        },
      },
    });
  }

  async function handleArchiveArea(id: string) {
    await archiveArea({ variables: { areaData: { id, isActive: false } } });
  }

  async function handleRestoreArea(id: string) {
    await restoreArea({ variables: { areaData: { id, isActive: true } } });
  }

  return (
    <>
      <Title
        title="Innstillinger"
        overline="JanHus Booking"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "JanHus",
            href: "/janhus",
          },
          {
            name: "Adminside",
            href: "/janhus/admin",
          },
          {
            name: "Innstillinger",
            href: "/janhus/admin/settings",
          },
        ]}
      />

      <Container>
        <PermissionRequired permission="janhus.manage_settings">
          <Stack direction="column" spacing={4}>
            {alert ? <Alert severity={alert.severity}>{alert.message}</Alert> : null}

            <SemesterSettings
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              settingsSaving={settingsSaving}
              saveSettings={saveSettings}
            />

            <Divider />

            <BookingRulesSettings
              openingHourOptions={openingHourOptions}
              closingHourOptions={closingHourOptions}
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              settingsSaving={settingsSaving}
              saveSettings={saveSettings}
            />

            <Divider />

            <AreaSettings
              saveArea={saveArea}
              handleArchiveArea={handleArchiveArea}
              handleRestoreArea={handleRestoreArea}
              areas={areaData?.janhusAreas ?? []}
              areaForms={areaForms}
              setAreaForms={setAreaForms}
              areaSaving={areaSaving}
            />
          </Stack>
        </PermissionRequired>
      </Container>
    </>
  );
};

JanHusSettingsPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusSettingsPage;
