import type { NextApiRequest, NextApiResponse } from "next";

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ healthy: true });
};

export default handler;
