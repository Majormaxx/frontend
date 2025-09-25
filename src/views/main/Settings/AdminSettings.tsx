import React from 'react';
import SettingsForm from '@/components/settings/SettingsForm';
import Container from '@/components/shared/Container';

/**
 * Renders the admin settings view, providing a container for the SettingsForm.
 */
const AdminSettings = () => {
    return (
        <Container>
            <h4>Admin Settings</h4>
            <div className="mt-4">
                <SettingsForm />
            </div>
        </Container>
    );
};

export default AdminSettings;