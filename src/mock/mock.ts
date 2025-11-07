import { createServer } from 'miragejs'
import appConfig from '@/configs/app.config'

import { signInUserData } from './data/authData'
import {
    mockPayoutRounds,
    mockRecipients,
    mockPayouts
} from './data/payoutData'

import { authFakeApi, payoutFakeApi, orgFakeApi } from './fakeApi'

const { apiPrefix } = appConfig

export function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                signInUserData,
                payoutRounds: mockPayoutRounds,
                payoutRecipients: mockRecipients,
                payouts: mockPayouts,
            })
        },
        routes() {
            this.urlPrefix = ''
            this.namespace = ''

            // Define our mock API routes first
            authFakeApi(this, apiPrefix)
            orgFakeApi(this, apiPrefix)
            payoutFakeApi(this, apiPrefix)

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
