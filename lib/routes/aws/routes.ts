import { AwsHelpers } from "./helpers";

export class AwsRoutes {
  public static async getPreSignedUrl(req, res, next) {
    try {
      const { fileName, fileType } = req.query;
      const { url, keyFile } = await AwsHelpers.getSignedUrl(
        fileName,
        fileType
      );
      res.json({ url, keyFile });
    } catch (error) {
      next(error);
    }
  }
}
