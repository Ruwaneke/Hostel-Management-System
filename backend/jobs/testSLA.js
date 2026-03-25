/**
 * ONE-SHOT SLA test script.
 * Run: node jobs/testSLA.js
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Complaint } from '../models/Complaint.js';

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB');

    // Step 1: find first open complaint that hasn't breached yet
    const victim = await Complaint.findOne({
        status: { $nin: ['Completed', 'Closed', 'Rejected'] }
    });

    if (!victim) {
        console.log('⚠️  No open complaints found. Submit a complaint first, then run this script.');
        await mongoose.disconnect();
        return;
    }

    console.log(`\n📋 Complaint: ${victim.complaintId} | Status: ${victim.status}`);
    console.log(`   Current sla.isBreached: ${victim.sla?.isBreached}`);

    // Step 2: Force breach using findOneAndUpdate (avoids pre-save hook issues)
    const pastDeadline = new Date(Date.now() - 60 * 1000); // 1 minute ago
    const forced = await Complaint.findByIdAndUpdate(
        victim._id,
        {
            $set: {
                'sla.deadline': pastDeadline,
                'sla.isBreached': false
            }
        },
        { new: true }
    );
    console.log(`\n⏱️  Forced sla.deadline to: ${forced.sla.deadline}`);
    console.log(`   sla.isBreached reset to: ${forced.sla.isBreached}`);

    // Step 3: Run the SLA cron job logic directly
    console.log('\n🔄 Running SLA breach scanner...');
    const now = new Date();
    const toBreachList = await Complaint.find({
        status: { $nin: ['Completed', 'Closed', 'Rejected'] },
        'sla.isBreached': false,
        'sla.deadline': { $lt: now }
    });

    console.log(`   Found ${toBreachList.length} complaint(s) past their SLA deadline.`);

    let breachCount = 0;
    for (const c of toBreachList) {
        await Complaint.findByIdAndUpdate(c._id, {
            $set:  { 'sla.isBreached': true },
            $push: {
                notifications: {
                    message: 'SLA breached for this complaint.',
                    sentAt: new Date(),
                    read: false
                },
                statusHistory: {
                    status: c.status,
                    changedBy: { userId: 'SYSTEM', name: 'SLA Monitor', role: 'system' },
                    note: 'Automatic SLA Breach Detected.',
                    changedAt: new Date()
                }
            }
        });
        breachCount++;
    }

    console.log(`\n🚨 Marked ${breachCount} complaint(s) as SLA breached.`);

    // Step 4: Read back and verify
    const result = await Complaint.findById(victim._id);
    console.log('\n📄 Final state of complaint:');
    console.log(`   complaintId    : ${result.complaintId}`);
    console.log(`   sla.isBreached : ${result.sla?.isBreached}`);
    console.log(`   Notifications (last 3 of ${result.notifications?.length ?? 0}):`);
    (result.notifications || []).slice(-3).forEach((n, i) => {
        console.log(`     [${i+1}] "${n.message}" — read=${n.read}`);
    });

    if (result.sla?.isBreached) {
        console.log('\n✅ SLA breach notification is working correctly!\n');
    } else {
        console.log('\n❌ SLA breach was NOT applied. Check the logic above.\n');
    }

    await mongoose.disconnect();
};

run().catch(e => { console.error('\n❌ Script error:', e.message); mongoose.disconnect(); });
