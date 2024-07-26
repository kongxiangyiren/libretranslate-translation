import { Context, Schema } from "koishi";
import { UniversalTranslation } from "./service";

export const name = "libretranslate-translation";

export interface CF {
  LibreTranslateUrl: string;
  LibreTranslateKey?: string;
  defaultTargetLang: string;
}

export const Config: Schema<CF> = Schema.object({
  LibreTranslateUrl: Schema.string().description(
    "LibreTranslate 的地址，如：https://libretranslate.com/translate"
  ),
  LibreTranslateKey: Schema.string().description("LibreTranslate 的key,如果有"),
  defaultTargetLang: Schema.string()
    .description("默认的目标语言代码（'en' 或 'zh'）")
    .default("en"),
});

const languageMap = ["zh", "en"];

export function apply(ctx: Context, config: CF) {
  const translation = new UniversalTranslation(ctx, config);

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

      const to = options?.to
        ? languageMap[options.to] || options.to
        : config.defaultTargetLang;

      const result = await translation.translate({
        input: text,
        target: to,
      });
      return result;
    });
}
