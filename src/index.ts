import { Context, Logger, Schema } from "koishi";

import Translator from "@koishijs/translator";
import { readFileSync } from "fs";
import { resolve } from "path";

class LibretranslateTranslation extends Translator<LibretranslateTranslation.Config> {
  static inject = ["http"];
  declare logger: Logger;

  name = "libretranslate-translation";
  static usage = `${readFileSync(resolve(__dirname, "../readme.md")).toString(
    "utf-8"
  )}`;

  constructor(ctx: Context, config: LibretranslateTranslation.Config) {
    super(ctx, config);

    ctx
      .command("libretranslate-translation <text:text>", "翻译命令")
      .alias("翻译")
      .usage("注意：参数请写在最前面，不然会被当成 text 的一部分！")
      .option("to", "-t [language] 指定翻译的目标语言", {
        fallback: config.defaultTargetLang,
      })
      .example("翻译 -t zh Hello World")
      .action(async ({ options }, text) => {
        if (!text) {
          return "请输入要翻译的文本...";
        }
        if (!config.LibreTranslateUrl) {
          return "请先配置LibreTranslateUrl";
        }
        const to = options?.to ? options.to : config.defaultTargetLang;

        const result = await this.translate({
          input: text,
          target: to,
        });
        return result;
      });

    ctx.command("libretranslate-translation/查询支持语言").action(async () => {
      if (!config.LibreTranslateUrl) {
        return "请先配置LibreTranslateUrl";
      }

      const url =
        config.LibreTranslateUrl.slice(
          0,
          config.LibreTranslateUrl.lastIndexOf("/")
        ) + "/languages";

      const languages = await this.getLanguages(url);

      return (
        `说明：[{
code:语言代码
name:可读的语言名称(英文)
targets	[
支持翻译的目标语言代码
]
}]\n详情：` + JSON.stringify(languages, null, 2)
      );
    });
  }

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

  async getLanguages(url: string) {
    try {
      const responseData = await this.ctx.http.get(url);
      return responseData;
    } catch (error: any) {
      this.logger.error(`API request failed for ${url}: ${error.message}`);
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
