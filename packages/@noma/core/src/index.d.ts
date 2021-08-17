export default function (id: String, options: NomaOptions) : Promise<NomaContext>;

export interface NomaOptions {
  debug: Boolean
}

export interface NomaContext {
  basedir: String
  environment: String
  serviceName: String
}