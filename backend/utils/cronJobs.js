import cron from 'node-cron';
import Booking from '../models/Booking.js';

// This function runs every single day at 12:01 AM automatically
export const startCronJobs = () => {
    
    // The cron expression '1 0 * * *' means "Run at minute 1 past midnight, every day"
    cron.schedule('1 0 * * *', async () => {
        console.log('⏰ [CRON JOB] Running daily rent check...');

        try {
            const today = new Date();

            // 1. Find all ACTIVE students whose nextRentDueDate is TODAY or EARLIER, and who currently think they are "Paid"
            const dueBookings = await Booking.find({
                status: 'Active',
                monthlyRentStatus: 'Paid',
                nextRentDueDate: { $lte: today } // $lte means "Less than or equal to" today
            });

            if (dueBookings.length > 0) {
                console.log(`⚠️ Found ${dueBookings.length} students whose rent is due today!`);

                // 2. Update all of them to 'Unpaid'
                for (let booking of dueBookings) {
                    booking.monthlyRentStatus = 'Unpaid';
                    
                    // Push their next due date forward by another 30 days so the cycle continues
                    const nextMonth = new Date(booking.nextRentDueDate);
                    nextMonth.setDate(nextMonth.getDate() + 30);
                    booking.nextRentDueDate = nextMonth;

                    await booking.save();
                    console.log(`✅ Marked Room ${booking.roomNumber} (${booking.studentName}) as UNPAID.`);
                }
            } else {
                console.log('✨ No rent payments are due today.');
            }

        } catch (error) {
            console.error('❌ [CRON ERROR] Failed to run rent check:', error);
        }
    });

    console.log('🤖 Monthly Rent Automation Cron Job Initialized.');
};