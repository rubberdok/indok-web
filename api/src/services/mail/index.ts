import { inject, injectable } from "inversify";

import { EmailContent, IMailClient, IMailService } from "./interfaces";

import { env } from "@/config";
import { CoreTypes } from "@/core";

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
