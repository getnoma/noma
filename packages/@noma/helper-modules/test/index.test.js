import { loadModule, resolveModule } from '@noma/helper-modules'

describe('@noma/helper-modules', () => {
	describe('loadModule', () => {
		describe('when loading module by package name', () => {
			let module

			before(async () => {
				module = await loadModule('package', './test')
			})

			it('should load main module in package', () => {
				expect(module.default).to.be.a('function')
			})
		})
	})

	describe('resolveModule', () => {
		describe('when resolving module by package name', () => {
			let module

			before(async () => {
				module = await resolveModule('package', './test')
			})

			it('should resolve main module in package', () => {
				expect(module.id).to.eql('package')
			})
		})

		describe('when resolving module using package name and export name', () => {
			let module

			before(async () => {
				module = await resolveModule('package/other', './test')
			})

			it('should resolve other module in package', () => {
				expect(module.id).to.eql('package/other')
			})
		})

		describe('when resolving self using package name', () => {
			let module

			before(async () => {
				module = await resolveModule('@noma/helper-modules/another')
			})

			it('should resolve self', () => {
				expect(module.id).to.eql('@noma/helper-modules/another')
			})
		})
	})
})
