import { Context } from "koishi";
import { UniversalTranslation } from "./service";
import { Config } from "./config";
export * from "./config";

export const name = "libretranslate-translation";

export function apply(ctx: Context, config: Config) {
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
      if (!config.LibreTranslateUrl) {
        return "请先配置LibreTranslateUrl";
      }
      const to = options?.to ? options.to : config.defaultTargetLang;

      const result = await translation.translate({
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

    const languages = await translation.getLanguages(url);

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
