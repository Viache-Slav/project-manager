import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoles = async (req, res) => {
  res.json([
    'admin',
    'designer',
    'employee',
  ]);
};


export const approveUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required for approval' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'approved';
    user.role = role;
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ message: 'User rejected' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
