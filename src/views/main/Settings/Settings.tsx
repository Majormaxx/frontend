import Tabs from '@/components/ui/Tabs'
import CompensationSettings from './CompensationSettings'
import TeamPointsContractSettings from './TeamPointsContractSettings'
import Payouts from './Payouts'
import useAuth from '@/utils/hooks/useAuth'
import AdminSettings from './AdminSettings'

const { TabNav, TabList, TabContent } = Tabs

const Settings = () => {
    const { user } = useAuth()

    return (
        <Tabs defaultValue="compensation">
            <TabList>
                <TabNav value="compensation">Compensation</TabNav>
                <TabNav value="teamPoints">Team Points Contract</TabNav>
                <TabNav value="payouts">Payouts</TabNav>
                {user.isMinter && <TabNav value="admin">Admin Settings</TabNav>}
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
                <TabContent value="admin">
                    <AdminSettings />
                </TabContent>
            </div>
        </Tabs>
    )
}

export default Settings