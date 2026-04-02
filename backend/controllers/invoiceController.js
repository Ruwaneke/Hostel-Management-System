import Invoice from '../models/Invoice.js';

// ==========================================
// GET ALL INVOICES FOR A SPECIFIC STUDENT
// ==========================================
export const getUserInvoices = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all invoices where the studentId matches the logged-in user
    // .sort({ createdAt: -1 }) ensures the newest invoices are at the top
    const invoices = await Invoice.find({ studentId: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    // Fetch all invoices and sort by newest first
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching all invoices:", error);
    res.status(500).json({ message: error.message });
  }
};