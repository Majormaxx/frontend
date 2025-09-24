import PayoutsForm from './PayoutsForm'

const Payouts = () => {
    return (
        <div>
            <div className="mb-8">
                <h3 className="mb-1">Payout Settings</h3>
                <p>
                    Configure your organization's payout settings. These settings will be used to distribute rewards to your team members.
                </p>
            </div>
            <PayoutsForm />
        </div>
    )
}

export default Payouts