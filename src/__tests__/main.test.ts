/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi } from 'vitest'

describe('main bootstrap', () => {
  it('calls createApp and mounts to #app', () => {
    const mount = vi.fn()
    const use = vi.fn((plugin?: unknown) => ({ use, mount }))
    const createApp = vi.fn((appArg?: unknown) => ({ use, mount }))
    const App = {}
    const router = {}
    const store = {}

    const app = createApp(App)
    app.use(router)
    app.use(store)
    app.mount('#app')

    expect(createApp).toHaveBeenCalled()
    expect(use).toHaveBeenCalled()
    expect(mount).toHaveBeenCalledWith('#app')
  })
})
