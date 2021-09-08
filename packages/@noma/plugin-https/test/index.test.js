import nomaPluginHttps from '../src/index.js'

describe('express', () => {
	let https

	before('https', async () => {
		https = await nomaPluginHttps({
			config: {
				servers: {
					default: {
						port: 44301,
						cert: `-----BEGIN CERTIFICATE-----
MIIDETCCAfkCFDBdUB3Ldc4Qzj/37PYVGLdNMqNlMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjEwOTA4MTIxMjM0WhcNNDkwMTIzMTIx
MjM0WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UE
CgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAupEXaeFzHcj17E8LEpUnqblOcaqoFDfBtEFBp9lP8jIIGs75
j1wuXxOqBPqjjWS4+MkwaftE3Iib9/x4LOjG9z2O97bTtJqfj2o+dzIJI8R7LUxJ
cGxOcXuyj/6INCEyyvSICWlucR7VMHgR8as/iPHhRDT0Xxr4VPlu1/9htV/w/j2e
4dcVtCyLIhUrRpr1Hiu+ZVbQd53Y3eqC/yvU8kNSpEn0fYsNEMHkZ9ooIBiri0Ce
pHZwq6oc/dj4WJHk0ATYpULUXzjr2eXyo5sjCr+CfwdZAQsY29iMnY0F70blGp2B
4GX6uPW95UFjclkKmFREXkIz1st1aC6wXlMy9wIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQAjmTO7XxDAm2weytqAg0WWTcpgXxV9bIVcWzsAn5dhpkVKkOUjjKo3JJVZ
lnYwFsYomtp+uVwmA6LeRFe7tU2tj1T7JwOjOcZTxqlMRQfvXJjaqzeu//3DSyb6
q9FtjsujiyIvmbYEAKMQopsarD1Id3S1brMjCfEiuwnEw5IauNCzPHUwS6CWSJUs
n3cYbobRvp+RPOcJ48N6Abgnc0MaHHuMl4RkVuwsQdb9hqUSBR4Ukg2Q7AT5JdOF
2hC91+ZeEogzbTnr3jkCKPIcLR+0rkThOLxZkVIL2TfcqWWHKHfdtAxeq6zo3hFP
SMq1Et6ZafiWRmgGEtFJcTigafCM
-----END CERTIFICATE-----
`,
						key: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAupEXaeFzHcj17E8LEpUnqblOcaqoFDfBtEFBp9lP8jIIGs75
j1wuXxOqBPqjjWS4+MkwaftE3Iib9/x4LOjG9z2O97bTtJqfj2o+dzIJI8R7LUxJ
cGxOcXuyj/6INCEyyvSICWlucR7VMHgR8as/iPHhRDT0Xxr4VPlu1/9htV/w/j2e
4dcVtCyLIhUrRpr1Hiu+ZVbQd53Y3eqC/yvU8kNSpEn0fYsNEMHkZ9ooIBiri0Ce
pHZwq6oc/dj4WJHk0ATYpULUXzjr2eXyo5sjCr+CfwdZAQsY29iMnY0F70blGp2B
4GX6uPW95UFjclkKmFREXkIz1st1aC6wXlMy9wIDAQABAoIBAB2b40xhhGSIvUbY
sJgtZdMQ3rs5a11yD+LsrF/YJFD60cB3crHm3lEmjMgngwdwoc6SF4XqY95gK+iq
f+QYuWMJuQPlVyoFlCctpGZEYaD0kNv6jHk0Jyrph8hEjBdB4Y7GSkS8H9QCIbGE
jMx+8iFoyeiKQvJJFHpf79CF7lrbbouysHk4iJMGK0KP+zv0yp0zaPnOLRyn8nMS
QEg0dcztkTs9N7rt8A6WMK0lR98AEFH4hh5bO3sgMWZ3CnicJ+Pl9KNGecUBLWSi
eV+y6Nh2Gv7S/cpoyWobYjrSGGun5a84KFBmsY84BqGPCjUUysiCPzINzdV6Ng44
jEkXEvkCgYEA7L04F9sElF9zP7xYHdqfK7YcFYsyKScJUyNYuql6j51tJMLasiXJ
MXnqtE8KGW6Syvu2nak4iiohFiCA+qkHZv6uzxJUlUQH4Ye6Svmq+5KBL/fk8MPk
SFXRQsA5crY+iKyKMUOOF3c1+RhFTzExNRDOkAObsLcrhKDlER7H9f0CgYEAyb7j
BAnTLL80vxXQZzx60zoukbXouRCcBtklbWcsjqsriIKwI8tfbj7LMeKqRqgSusdj
zV7wxGh8u2KJ28cOO47ifZ5fdx0WjAL4FygSpfJmKNwZT1IVRRGdJh8VnkFq+h9q
h8G2ovH2wgeYrELzzjY/1d6gHZaBKUE0o6mw5QMCgYEA2QXxmTTnstj5vxD7OosD
Zb/xaPKNDlrB2pxJp/zb5TItLwkOEUhAc4HPXnIi0QOjwD8Wvtu1gDt0z2MGukMg
DRQmzp+AOMH/84lIh5jvXOaGVaIMF4eNC57YUjgDshxNoV+C4/yJEwvux6avSxTO
hlYc9rrIDC0u0MvqklJEf0UCgYBi4fbvMcmZsxYtWonNL+2bvna44Ipyutte1+vq
VZmXS/qIbFXdFX9uz8RUbR68hwC3H6ehL5mfCv+n8MJVQJmPQ5drrsZn4Y/9jC8B
WpjZUZgVCtw07qySL/Hwj2fPK409j0xtwdq8vxANRh/kvuQ0/I4JS5b7KZuhFt6w
ISoc9QKBgCeHPFWyvgSuTBO1J6e5Pcg60dUZnW8ep2C2KrV069+zXW1i8bMPc1En
Q/o4WI5NQWt0vmH8xRKyrmhfbIQXeHiGA7Es2/u3efwXuScnoVHjc4iZWZjlu09Y
I/HJ0ZH8JGFwzut8bI39HgMkSZI06oNMwn7SAULsiCWKd5mY5H7y
-----END RSA PRIVATE KEY-----
`
					}
				}
			}
		})
	})

	describe('server', () => {
		it('should run on port 44301', () => {
			expect(https.server).to.have.property('port', 44301)
		})
	})

	describe('servers', () => {
		describe('default', () => {
			it('should run on port 44301', () => {
				expect(https.servers.default).to.have.property('port', 44301)
			})
		})
	})
})
