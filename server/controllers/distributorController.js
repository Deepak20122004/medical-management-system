import Distributor from "../models/Distributor.js";

/* ADD */
export const addDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.create(req.body);
    res.status(201).json({ success: true, message: "Distributor Added", distributor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* GET ALL */
export const getDistributors = async (req, res) => {
  const data = await Distributor.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

/* UPDATE */
export const updateDistributor = async (req, res) => {
  const updated = await Distributor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ success: true, message: "Updated Successfully", updated });
};

/* DELETE */
export const deleteDistributor = async (req, res) => {
  await Distributor.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted Successfully" });
};