import { inject, injectable } from "inversify";

import { env } from "@/config";
import { CoreTypes } from "@/core";

import { EmailContent, IMailClient, IMailService } from "./interfaces";

@injectable()
export default class MailService implements IMailService {
  constructor(@inject(CoreTypes.MailClient) private client: IMailClient) {}

  send(template: EmailContent) {
    return this.client.sendEmailWithTemplate({
      ...template,
      From: template.From ?? env.NO_REPLY_EMAIL,
    });
  }
}
