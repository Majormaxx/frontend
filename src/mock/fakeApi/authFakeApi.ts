import { Server, Response } from 'miragejs'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'

export default function authFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/sign-in`, (schema, { requestBody }) => {
        const { userName, password } = JSON.parse(requestBody)
        const user = schema.db.signInUserData.findBy({
            accountUserName: userName,
            password,
        })
        if (user) {
            const { avatar, userName, email, authority } = user
            return {
                user: { avatar, userName, email, authority },
                token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
            }
        }
        return new Response(
            401,
            { some: 'header' },
            { message: 'Invalid email or password!' }
        )
    })

    server.post(`${apiPrefix}/sign-out`, () => {
        return true
    })

    server.post(`${apiPrefix}/sign-up`, (schema, { requestBody }) => {
        const { userName, password, email } = JSON.parse(requestBody)
        const userExist = schema.db.signInUserData.findBy({
            accountUserName: userName,
        })
        const emailUsed = schema.db.signInUserData.findBy({ email })
        const newUser = {
            avatar: '/img/avatars/thumb-1.jpg',
            userName,
            email,
            authority: ['admin', 'user'],
        }
        if (!isEmpty(userExist)) {
            const errors = [
                { message: '', domain: 'global', reason: 'invalid' },
            ]
            return new Response(
                400,
                { some: 'header' },
                { errors, message: 'User already exist!' }
            )
        }

        if (!isEmpty(emailUsed)) {
            const errors = [
                { message: '', domain: 'global', reason: 'invalid' },
            ]
            return new Response(
                400,
                { some: 'header' },
                { errors, message: 'Email already used' }
            )
        }

        schema.db.signInUserData.insert({
            ...newUser,
            ...{ id: uniqueId('user_'), password, accountUserName: userName },
        })
        return {
            user: newUser,
            token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
        }
    })

    server.post(`${apiPrefix}/forgot-password`, () => {
        return true
    })

    server.post(`${apiPrefix}/reset-password`, () => {
        return true
    })

    // Wallet authentication endpoints
    server.post(`${apiPrefix}/users/auth/nonce`, (schema, { requestBody }) => {
        console.log('Mock API: getNonce called with:', requestBody)
        const { walletAddress } = JSON.parse(requestBody)
        // Generate an alphanumeric nonce (at least 8 characters)
        const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36)
        console.log('Mock API: returning nonce:', nonce)
        // Return a mock nonce for wallet authentication
        return {
            nonce
        }
    })

    server.post(`${apiPrefix}/users/auth/token`, (schema, { requestBody }) => {
        console.log('Mock API: verify called with:', requestBody)
        const { signature, message } = JSON.parse(requestBody)
        const token = 'mock-wallet-token-' + Date.now()
        console.log('Mock API: returning token:', token)
        // Mock successful wallet authentication
        return {
            token
        }
    })

    server.get(`${apiPrefix}/users/me`, () => {
        // Return mock user data for wallet authentication
        return {
            data: {
                id: 'mock-user-1',
                username: 'Wallet User',
                email: 'wallet@collabberry.xyz',
                walletAddress: '0x1234567890123456789012345678901234567890',
                organization: {
                    id: 'mock-org-1',
                    name: 'Mock Organization',
                    safeAddress: '',
                    stablecoinAddress: '',
                    recognitionTokenAddress: '',
                    recognitionMode: 'hours-based',
                    chain: 'arbitrumSepolia',
                    chainId: 421614
                },
                isMinter: true,
                profilePicture: '/img/avatars/thumb-1.jpg'
            }
        }
    })

    server.post(`${apiPrefix}/users`, (schema, request) => {
        console.log('Mock API: update user profile called')
        console.log('Request body:', request.requestBody)

        let userData: any = {}

        // Handle FormData
        if (request.requestBody instanceof FormData) {
            // Extract data from FormData
            const formData = request.requestBody
            userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                profilePicture: formData.get('profilePicture') ? '/img/avatars/thumb-1.jpg' : undefined
            }
        } else {
            // Handle JSON
            try {
                userData = JSON.parse(request.requestBody)
            } catch (e) {
                console.error('Failed to parse request body:', e)
            }
        }

        console.log('Parsed user data:', userData)

        // Mock successful profile update
        return {
            data: {
                id: 'mock-user-1',
                walletAddress: '0x1234567890123456789012345678901234567890',
                ...userData,
                organization: {
                    id: 'mock-org-1',
                    name: 'Mock Organization',
                    safeAddress: '',
                    stablecoinAddress: '',
                    recognitionTokenAddress: '',
                    recognitionMode: 'hours-based',
                    chain: 'arbitrumSepolia',
                    chainId: 421614
                },
                isMinter: true
            }
        }
    })
}
