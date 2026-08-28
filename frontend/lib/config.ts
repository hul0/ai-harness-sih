import appConfig from "@/config/app-config.json"

export type AppConfig = typeof appConfig

export const config: AppConfig = appConfig

export const {
  project,
  branding,
  navigation,
  sovereignty: sovereigntyConfig,
  approvalGate: approvalGateConfig,
  contextTabs: contextTabsConfig,
} = appConfig

export default config
