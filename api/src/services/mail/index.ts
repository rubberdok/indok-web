import { inject, injectable } from "tsyringe";

import { env } from "@/config";
import { CoreTypes } from "@/core";

import { EmailContent, IMailClient, IMailService } from "./interfaces";

@injectable()
export class MailService implements IMailService {
  constructor(@inject(CoreTypes.MailClient) private client: IMailClient) {}

  send(template: EmailContent) {
    return this.client.sendEmailWithTemplate({
      ...template,
      From: template.From ?? env.NO_REPLY_EMAIL,
    });
  }
}
