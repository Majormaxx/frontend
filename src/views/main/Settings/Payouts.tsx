import { Tabs } from '@/components/ui'
import PayoutsForm from './PayoutsForm'
import PayoutRounds from './PayoutRounds'
import PayoutStatus from './PayoutStatus'

const { TabNav, TabList, TabContent } = Tabs

const Payouts = () => {
    return (
        <div>
            <div className="mb-6">
                <h3 className="mb-1">Payouts</h3>
                <p>
                    Configure Safe multisig settings and manage token payouts for your organization.
                </p>
            </div>

            <Tabs defaultValue="settings">
                <TabList>
                    <TabNav value="settings">Settings</TabNav>
                    <TabNav value="rounds">Rounds</TabNav>
                    <TabNav value="status">Status & History</TabNav>
                </TabList>
                <div className="p-4">
                    <TabContent value="settings">
                        <div className="mb-4">
                            <h4 className="mb-2">Safe Configuration</h4>
                            <p className="text-gray-600 text-sm">
                                Configure your Safe multisig wallet and token addresses for automated payouts.
                            </p>
                        </div>
                        <PayoutsForm />
                    </TabContent>
                    <TabContent value="rounds">
                        <PayoutRounds />
                    </TabContent>
                    <TabContent value="status">
                        <PayoutStatus />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Payouts