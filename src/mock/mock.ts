import { createServer } from 'miragejs'
import appConfig from '@/configs/app.config'

import { signInUserData } from './data/authData'

import { authFakeApi } from './fakeApi'

const { apiPrefix } = appConfig

export function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                signInUserData,
            })
        },
        routes() {
            this.urlPrefix = ''
            this.namespace = ''

            // Define our mock API routes first
            authFakeApi(this, apiPrefix)

            // Passthrough external requests (but not our local API calls)
            this.passthrough((request) => {
                // Allow external requests (CDNs, analytics, etc.) but intercept our API
                const isExternalService = request.url.startsWith('http') &&
                                         !request.url.includes(window.location.host)
                return isExternalService
            })
        },
    })
}
