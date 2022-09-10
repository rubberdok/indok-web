import { ServerClient } from "postmark";
import { MessageSendingResponse, TemplatedMessage } from "postmark/dist/client/models";

type Modify<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface IMailClient extends ServerClient {}

export enum TemplateAliasEnum {
  EVENT_WAIT_LIST = "event-wait-list",
  CABIN_BOOKING_RECEIPT = "cabin-booking-receipt",
}

export type CabinBookingReceipt = {
  firstName: string;
  lastName: string;
};

type Model = {
  [TemplateAliasEnum.EVENT_WAIT_LIST]: {
    subject: string;
  };
  [TemplateAliasEnum.CABIN_BOOKING_RECEIPT]: CabinBookingReceipt;
};

export enum MessageStream {
  BROADCAST = "broadcast",
}

export type EmailContent =
  | Modify<
      TemplatedMessage,
      {
        From?: string;
      }
    > &
      (
        | {
            TemplateAlias: TemplateAliasEnum.EVENT_WAIT_LIST;
            TemplateModel: Model[TemplateAliasEnum.EVENT_WAIT_LIST];
          }
        | {
            TemplateAlias: TemplateAliasEnum.CABIN_BOOKING_RECEIPT;
            TemplateModel: Model[TemplateAliasEnum.CABIN_BOOKING_RECEIPT];
          }
      );

export interface IMailService {
  send(template: EmailContent): Promise<MessageSendingResponse>;
}
