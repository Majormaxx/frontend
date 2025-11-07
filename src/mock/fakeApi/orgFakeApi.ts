import { Server } from 'miragejs'

export default function orgFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/orgs`, (schema, request) => {
        console.log('Mock API: create organization called')

        let orgData: any = {}

        if (request.requestBody instanceof FormData) {
            const formData = request.requestBody
            orgData = {
                name: formData.get('name'),
                logo: formData.get('logo') ? '/img/avatars/org-logo.jpg' : undefined,
                teamPointsContractAddress: formData.get('teamPointsContractAddress'),
                chainId: formData.get('chainId')
            }
        } else {
            try {
                orgData = JSON.parse(request.requestBody)
            } catch (e) {
                console.error('Failed to parse request body:', e)
            }
        }

        const newOrg = {
            id: 'mock-org-' + Date.now(),
            name: orgData.name || 'Mock Organization',
            logo: orgData.logo,
            teamPointsContractAddress: orgData.teamPointsContractAddress || '0x1234567890123456789012345678901234567890',
            chainId: orgData.chainId || 421614,
            par: 1.0,
            compensationPeriod: 30,
            compensationStartDay: new Date().toISOString(),
            assessmentStartDelayInDays: 7,
            assessmentDurationInDays: 3,
            nextRoundDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            totalDistributedFiat: 0,
            totalDistributedTP: 0,
            roundsActivated: false,
            contributors: []
        }

        return {
            data: newOrg
        }
    })

    server.get(`${apiPrefix}/orgs/:id`, (schema, request) => {
        const id = request.params.id
        console.log('Mock API: get organization by id:', id)
        console.log('Mock API: returning settings:', storedSettings)

        return {
            data: {
                id: id,
                name: 'Test Organization',
                logo: '/img/avatars/org-logo.jpg',
                teamPointsContractAddress: '0x1234567890123456789012345678901234567890',
                chainId: storedSettings.chainId,
                chain: storedSettings.chain,
                safeAddress: storedSettings.safeAddress,
                stablecoinAddress: storedSettings.stablecoinAddress,
                recognitionTokenAddress: storedSettings.recognitionTokenAddress,
                recognitionMode: storedSettings.recognitionMode,
                par: 1.0,
                compensationPeriod: 30,
                compensationStartDay: new Date().toISOString(),
                assessmentStartDelayInDays: 7,
                assessmentDurationInDays: 3,
                nextRoundDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                totalDistributedFiat: 0,
                totalDistributedTP: 0,
                roundsActivated: false,
                contributors: [
                    {
                        id: 'mock-contributor-1',
                        walletAddress: '0x1234567890123456789012345678901234567890',
                        username: 'Admin User',
                        profilePicture: '/img/avatars/thumb-1.jpg',
                        isAdmin: true,
                        isContractAdmin: true
                    }
                ]
            }
        }
    })

    server.post(`${apiPrefix}/orgs/agreement`, (schema, request) => {
        console.log('Mock API: create contributor agreement called')

        const agreementData = JSON.parse(request.requestBody)

        return {
            data: {
                id: 'mock-agreement-' + Date.now(),
                userId: agreementData.userId,
                roleName: agreementData.roleName,
                responsibilities: agreementData.responsibilities,
                marketRate: agreementData.marketRate,
                commitment: agreementData.commitment,
                fiatRequested: agreementData.fiatRequested
            }
        }
    })

    server.get(`${apiPrefix}/orgs/contributors/:contributorId/agreements`, (schema, request) => {
        const contributorId = request.params.contributorId
        console.log('Mock API: get contributor agreement:', contributorId)

        return {
            data: {
                id: 'mock-agreement-1',
                userId: contributorId,
                roleName: 'Developer',
                responsibilities: 'Build features',
                marketRate: 5000,
                commitment: 80,
                fiatRequested: 2000
            }
        }
    })

    // Store for settings (in-memory for mock)
    let storedSettings = {
        id: 'mock-org-1',
        chain: 'sepolia',
        safeAddress: '',
        stablecoinAddress: '',
        recognitionTokenAddress: '',
        recognitionMode: 'discretionary' as const,
        chainId: 421614
    };

    server.put(`${apiPrefix}/orgs/settings`, (schema, request) => {
        console.log('Mock API: update organization settings')

        const settingsData = JSON.parse(request.requestBody)

        // Update stored settings
        storedSettings = {
            ...storedSettings,
            ...settingsData
        };

        console.log('Mock API: stored settings updated to:', storedSettings);

        return {
            data: storedSettings
        }
    })

    server.put(`${apiPrefix}/orgs`, (schema, request) => {
        console.log('Mock API: edit organization')

        let orgData: any = {}

        if (request.requestBody instanceof FormData) {
            const formData = request.requestBody
            orgData = {
                name: formData.get('name'),
                logo: formData.get('logo') ? '/img/avatars/org-logo.jpg' : undefined
            }
        }

        return {
            data: {
                id: 'mock-org-1',
                ...orgData
            }
        }
    })

    server.get(`${apiPrefix}/orgs/invitation`, () => {
        console.log('Mock API: get invitation token')

        return {
            data: {
                token: 'mock-invitation-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        }
    })

    server.get(`${apiPrefix}/rounds`, () => {
        console.log('Mock API: get rounds')

        return {
            data: [
                {
                    id: 'mock-round-1',
                    name: 'Round 1',
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'completed',
                    hasIncompletePayouts: true
                },
                {
                    id: 'mock-round-2',
                    name: 'Round 2',
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString(),
                    status: 'active',
                    hasIncompletePayouts: false
                }
            ]
        }
    })

    server.get(`${apiPrefix}/rounds/current`, () => {
        console.log('Mock API: get current round')

        return {
            data: {
                id: 'mock-round-2',
                name: 'Round 2',
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString(),
                status: 'active'
            }
        }
    })

    server.get(`${apiPrefix}/rounds/:id`, (schema, request) => {
        const id = request.params.id
        console.log('Mock API: get round by id:', id)

        return {
            data: {
                id: id,
                name: 'Test Round',
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                hasIncompletePayouts: true,
                assessments: []
            }
        }
    })

    server.put(`${apiPrefix}/rounds/setIsActive`, (schema, request) => {
        console.log('Mock API: activate rounds')

        const data = JSON.parse(request.requestBody)

        return {
            data: {
                roundsActivated: data.isActive
            }
        }
    })

    server.post(`${apiPrefix}/rounds/assess`, (schema, request) => {
        console.log('Mock API: add assessment')

        const assessmentData = JSON.parse(request.requestBody)

        return {
            data: {
                id: 'mock-assessment-' + Date.now(),
                ...assessmentData
            }
        }
    })

    server.get(`${apiPrefix}/rounds/:roundId/assessments`, (schema, request) => {
        const { roundId } = request.params
        const { assessorId, assessedId } = request.queryParams

        console.log('Mock API: get assessments for round:', roundId, { assessorId, assessedId })

        return {
            data: []
        }
    })

    server.put(`${apiPrefix}/rounds/:id`, (schema, request) => {
        const { id } = request.params
        const data = JSON.parse(request.requestBody)
        console.log('Mock API: edit round:', id, data)

        return {
            data: {
                id,
                ...data
            }
        }
    })

    server.post(`${apiPrefix}/rounds/:roundId/assessments/remind`, (schema, request) => {
        const { roundId } = request.params
        console.log('Mock API: remind contributors for round:', roundId)

        return {
            data: {
                success: true,
                reminded: 5
            }
        }
    })

    server.put(`${apiPrefix}/rounds/:roundId/assessments/:assessmentId`, (schema, request) => {
        const { roundId, assessmentId } = request.params
        const data = JSON.parse(request.requestBody)
        console.log('Mock API: edit assessment:', assessmentId, 'in round:', roundId)

        return {
            data: {
                id: assessmentId,
                roundId,
                ...data
            }
        }
    })

    server.post(`${apiPrefix}/rounds/:roundId/txHash`, (schema, request) => {
        const { roundId } = request.params
        const data = JSON.parse(request.requestBody)
        console.log('Mock API: add tx hash to round:', roundId, data)

        return {
            data: {
                roundId,
                txHash: data.txHash
            }
        }
    })

    server.delete(`${apiPrefix}/orgs/agreement/:agreementId`, (schema, request) => {
        const { agreementId } = request.params
        console.log('Mock API: delete agreement:', agreementId)

        return {
            data: {
                success: true
            }
        }
    })

    server.put(`${apiPrefix}/orgs/agreement/:agreementId`, (schema, request) => {
        const { agreementId } = request.params
        const data = JSON.parse(request.requestBody)
        console.log('Mock API: edit agreement:', agreementId, data)

        return {
            data: {
                id: agreementId,
                ...data
            }
        }
    })

    server.get(`${apiPrefix}/orgs/contributors/myscores`, () => {
        console.log('Mock API: get my scores')

        return {
            data: {
                totalPoints: 1250,
                rounds: [
                    {
                        roundId: 'mock-round-1',
                        roundName: 'Round 1',
                        points: 650,
                        fiatEarned: 500
                    },
                    {
                        roundId: 'mock-round-2',
                        roundName: 'Round 2',
                        points: 600,
                        fiatEarned: 450
                    }
                ]
            }
        }
    })
}
