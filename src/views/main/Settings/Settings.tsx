import Tabs from '@/components/ui/Tabs'
import CompensationSettings from './CompensationSettings'
import TeamPointsContractSettings from './TeamPointsContractSettings'
import Payouts from './Payouts'

const { TabNav, TabList, TabContent } = Tabs

const Settings = () => {
    return (
        <Tabs defaultValue="compensation">
            <TabList>
                <TabNav value="compensation">Compensation</TabNav>
                <TabNav value="teamPoints">Team Points Contract</TabNav>
                <TabNav value="payouts">Payouts</TabNav>
            </TabList>
            <div className="p-4">
                <TabContent value="compensation">
                    <h3 className="mb-4">Compensation Settings</h3>
                    <CompensationSettings />
                </TabContent>
                <TabContent value="teamPoints">
                    <h3 className="mb-4">Team Points Contract Settings</h3>
                    <TeamPointsContractSettings />
                </TabContent>
                <TabContent value="payouts">
                    <Payouts />
                </TabContent>
            </div>
        </Tabs>
    )
}

export default Settings