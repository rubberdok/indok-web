import { ServerClient } from "postmark";
import { env } from "../config";

export default new ServerClient(env.POSTMARK_API_TOKEN);
