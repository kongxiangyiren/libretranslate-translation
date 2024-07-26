import Translator from "./translator";
import { CF } from "./";
import { Logger } from "koishi";

export class UniversalTranslation extends Translator<CF> {
  declare logger: Logger;

  async translate(options?: Translator.Result) {
    const q = options?.input;
    const to = options?.target || "zh";
    try {
      const responseData = await this.ctx.http.post(
        this.config.LibreTranslateUrl,
        {
          q,
          source: "auto",
          target: to,
          format: "text",
          alternatives: 3,
          api_key: this.config.LibreTranslateKey ?? "",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return responseData.translatedText;
    } catch (error: any) {
      this.logger.error(
        `API request failed for ${this.config.LibreTranslateUrl}: ${error.message}`
      );
    }
  }
}
