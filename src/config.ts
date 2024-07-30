import { Schema } from "koishi";

export interface Config {
  LibreTranslateUrl: string;
  LibreTranslateKey?: string;
  defaultTargetLang: string;
}

export const Config: Schema<Config> = Schema.object({
  LibreTranslateUrl: Schema.string().description(
    "LibreTranslate 的地址，如：https://libretranslate.com/translate"
  ),
  LibreTranslateKey: Schema.string().description("LibreTranslate 的key,如果有"),
  defaultTargetLang: Schema.string()
    .description("默认的目标语言代码（'en' 或 'zh'等）")
    .default("en"),
});
