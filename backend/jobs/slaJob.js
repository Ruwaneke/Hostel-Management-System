import cron from 'node-cron';
import { Complaint } from '../models/Complaint.js';

export const startSLAJob = () => {
    // Run every 10 minutes to check for SLA breaches
    cron.schedule('*/10 * * * *', async () => {
        try {
            const complaints = await Complaint.find({
                status: { $nin: ["Completed", "Closed", "Rejected"] },
                "sla.isBreached": false,
            });

            let breachCount = 0;
            const now = new Date();

            for (const complaint of complaints) {
                if (complaint.sla && complaint.sla.deadline && now > new Date(complaint.sla.deadline)) {
                    complaint.sla.isBreached = true;
                    
                    // Add an alert to the notification array
                    complaint.notifications.push({
                        message: "SLA breached for this complaint.",
                        sentAt: new Date(),
                        read: false
                    });
                    
                    // Add an audit trail entry for the SLA breach
                    complaint.statusHistory.push({
                        status: complaint.status,
                        changedBy: { userId: "SYSTEM", name: "SLA Monitor", role: "system" },
                        note: "Automatic SLA Breach Detected."
                    });
                    
                    await complaint.save();
                    breachCount++;
                }
            }

            if (breachCount > 0) {
                console.log(`[SLA Job] Found and updated ${breachCount} breached complaints.`);
            }
        } catch (err) {
            console.error('[SLA Job] Error running job:', err);
        }
    });

    console.log('[SLA Job] SLA monitoring cron job initialized.');
};
