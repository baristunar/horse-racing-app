import { describe, it, expect } from 'vitest'
import router from '../router'
import HomePage from '../views/homepage/index.vue'
import type { RouteRecordRaw } from 'vue-router'

describe('router', () => {
  it('has a root route to Home', () => {
    const routes = (router as unknown as { options: { routes: readonly RouteRecordRaw[] } }).options
      .routes
    const root = routes.find((r) => r.path === '/')

    expect(root).toBeDefined()

    if (!root) return

    expect(root.name).toBe('Home')
    expect(root.component).toBe(HomePage)
  })
})
