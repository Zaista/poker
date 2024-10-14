import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'gp99p1',
  e2e: {
    baseUrl: 'http://localhost:3000'
  },
})
