export default async function main({ config }) {
  console.info(config.worker.message)

  return {
    worker: true
  }
}
