import nomaPluginHttps from '../src/index.js'

describe('express', () => {
  let https

  before('https', async () => {
    https = await nomaPluginHttps({
      config: {
        servers: {
          default: {
            port: 443,
            cert: `-----BEGIN CERTIFICATE-----
MIICNDCCAZ0CFGUw/BCL8bkMmk+KlekQKdfHS6OjMA0GCSqGSIb3DQEBCwUAMFkx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQxEjAQBgNVBAMMCWxvY2FsaG9zdDAeFw0yMTAz
MTcxNjQ1NThaFw0yMTA0MTYxNjQ1NThaMFkxCzAJBgNVBAYTAkFVMRMwEQYDVQQI
DApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQx
EjAQBgNVBAMMCWxvY2FsaG9zdDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA
rKxtCIoVwBfQz0/OKNcDKiJL4Lfv+r2070bpDr3dgeoMlcebvU++3e5qzd+/puyd
0bJFRVc6E0xCq4fWp9VgQ0Rgqi8t7NBj5Uh9JAjUbpaf6aoplhtvSR7aYfhYjSbI
9SMORphW7B4YPHBMynnYvvi3ovvgE4ioZqJ7awewXNECAwEAATANBgkqhkiG9w0B
AQsFAAOBgQB+FLTkEgC++MZF6ejYIl6QWBKyqxlkmldRbzZKpIRjgZaDezHJ5km0
UJ2osWNRuhoA0o7PjGOvG29OzywHL71QObEXused3R2f5pH/LEm6XqWUDN0F/h5S
I6SxPqQcsoarSxJYES+gGr/F8sK7u7uEUm724YmzgFOl3Q6efxph3g==
-----END CERTIFICATE-----
`,
            key: `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCsrG0IihXAF9DPT84o1wMqIkvgt+/6vbTvRukOvd2B6gyVx5u9
T77d7mrN37+m7J3RskVFVzoTTEKrh9an1WBDRGCqLy3s0GPlSH0kCNRulp/pqimW
G29JHtph+FiNJsj1Iw5GmFbsHhg8cEzKedi++Lei++ATiKhmontrB7Bc0QIDAQAB
AoGBAIOK340v1J4ABpzICR/nnIuOkQtiVLlJp/rYpFcMoSCFMo0wAR7ZD2h2Znrr
x07c1uWWz1qhtqZY5DlURFybGrcjmqKsBAHtawyGFo+S9m6IdL/cpQQJK0JKX/07
VzqFJnnIn5ePPXARQ0yphDi6nDFSpVuEhwLLl8/euybG9ns5AkEA0x2UIRPNJYg4
tDUA7H1YBaBd5hrrkhtOLyEioNSsBSaGcv+9Rr33FJY2LxaA5osGugNTng/0e9FJ
flmYgqgUQwJBANFijtEUi5CpT66XTHEHBK/j99kobxYS33RU9szXn7jPrGXSn+1Z
F2tN9ZNcnBg0umosK/S3F4UPAd6txvtkI1sCQBIjpXmeGO9ToAOj1jt7nZeGKus9
fuYj4HjeMPp+q3UZ1U2GOb4dTmB/c5JiLZshcOeEp6eaGViWJ+lqS1dWl78CQQCV
5h8kY7b+25dmAH8DM+kRGv1nA+FzRhOfLux4/a0lG9fqFX3U58EyWt+CnfxKAAWs
2O6nBSTbZ0EJcBNSCgCdAkAOihtt9pNR2siFlNhsRcRbFeGWQIFdLzDtWfyPSdOp
ppPdC1A3rPrjThOU9cYvBPAxOPSsvdQN2zA2HWWRCfNo
-----END RSA PRIVATE KEY-----`
          }
        }
      }
    })
  })

  describe('server', () => {
    it('should run on port 443', () => {
      expect(https.server).to.have.property('port', 443)
    })
  })

  describe('servers', () => {
    describe('default', () => {
      it('should run on port 443', () => {
        expect(https.servers.default).to.have.property('port', 443)
      })
    })
  })
})
