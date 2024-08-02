import { Logger, Schema } from "koishi";

import Translator from "@koishijs/translator";

class LibretranslateTranslation extends Translator<LibretranslateTranslation.Config> {
  static inject = ["http"];
  declare logger: Logger;

  name = "libretranslate-translation";

  async translate(options?: Translator.Result): Promise<string> {
    const q = options?.input;
    const to = options?.target || "zh";
    const source = options?.source || "auto";
    try {
      const responseData = await this.ctx.http.post(
        this.config.LibreTranslateUrl,
        {
          q,
          source: source,
          target: to,
          format: "text",
          alternatives: 3,
          api_key: this.config.LibreTranslateKey || "",
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

namespace LibretranslateTranslation {
  export interface Config extends Translator.Config {
    LibreTranslateUrl: string;
    LibreTranslateKey?: string;
    defaultTargetLang: string;
  }

  export const Config: Schema<Config> = Schema.object({
    LibreTranslateUrl: Schema.string().description(
      "LibreTranslate 的地址，如：https://libretranslate.com/translate"
    ),
    LibreTranslateKey: Schema.string().description(
      "LibreTranslate 的key,如果有"
    ),
    defaultTargetLang: Schema.string()
      .description("默认的目标语言代码（'en' 或 'zh'等）")
      .default("en"),
  });
}

export default LibretranslateTranslation;
