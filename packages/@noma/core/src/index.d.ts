export default function (id: String, options: NomaOptions) : Promise<NomaContext>;

export interface NomaOptions {
  debug: Boolean
}

export interface NomaContext {
  debug: Function
  environment: String
  serviceName: String
}