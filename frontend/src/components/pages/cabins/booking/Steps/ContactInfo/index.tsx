import { useQuery } from "@apollo/client/react";

import { CabinFragment, UserDocument } from "@/generated/graphql";

import { InputFields } from "./InputFields";

export type BasicBooking = {
  firstName: string;
  lastName: string;
  phone: string;
  receiverEmail: string;
};

export type Participants = {
  internalParticipants: number;
  externalParticipants: number;
};

export type ContactInfo = BasicBooking & Participants;

type Props = {
  chosenCabins: CabinFragment[];
  contactInfo?: ContactInfo;
  onSubmit: (data: ContactInfo) => void;
  onPrevious: () => void;
};

/**
 * One of the steps in the cabins/book page.
 * Fetches the current user and tries to input its values to the InputFields.
 */
export const CabinContactInfo: React.FC<Props> = ({ chosenCabins, onSubmit, onPrevious, contactInfo }) => {
  const { data } = useQuery(UserDocument);

  /**
   * We default to the previously submitted info,
   * or the info from the user if it exists.
   */
  const defaultContactInfo = {
    firstName: data?.user?.firstName,
    lastName: data?.user?.lastName,
    receiverEmail: data?.user?.email,
    phone: data?.user?.phoneNumber,
    externalParticipants: 0,
    internalParticipants: 0,
    ...contactInfo,
  };

  return (
    <InputFields
      defaultContactInfo={defaultContactInfo}
      chosenCabins={chosenCabins}
      onSubmit={onSubmit}
      onPrevious={onPrevious}
    />
  );
};
