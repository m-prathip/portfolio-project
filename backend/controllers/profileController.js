const Profile = require('../models/Profile');
const Skill = require('../models/Skills');
const Project = require('../models/Projects');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Achievement = require('../models/Achievements');
const Certificate = require('../models/Certificate');
const Activity = require('../models/Activities');

// @desc   Get the logged-in user's own profile (for editing in the dashboard)
// @route  GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not set up yet' });
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc   Create or update the logged-in user's profile
// @route  PUT /api/profile/me
const updateMyProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.user; // ownership always comes from the authenticated session

    if (req.files?.profileImage) {
      data.profileImage = req.files.profileImage[0].path.startsWith('http')
        ? req.files.profileImage[0].path
        : '/uploads/' + req.files.profileImage[0].filename;
    }
    if (req.files?.resume) {
      data.resumeUrl = req.files.resume[0].path.startsWith('http')
        ? req.files.resume[0].path
        : '/uploads/' + req.files.resume[0].filename;
    }

    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true, runValidators: true });
    } else {
      profile = await Profile.create({ ...data, user: req.user.id });
    }
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc   Get a user's public profile by username, for their /u/:username
//         portfolio page. Always 200s if the account exists (resolveUser
//         already 404'd otherwise) — isSetup distinguishes "this account
//         exists but hasn't published a profile yet" from real data.
// @route  GET /api/profile/public/:username
const getPublicProfile = async (req, res) => {
  try {
    const userId = req.portfolioUser._id;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.json({ username: req.portfolioUser.username, isSetup: false });
    
    // Fetch all related sections in parallel to avoid frontend waterfalls
    const [skills, projects, experience, education, achievements, certificates, activities] = await Promise.all([
      Skill.find({ user: userId }).sort('order'),
      Project.find({ user: userId }).sort('order'),
      Experience.find({ user: userId }).sort('-startDate'),
      Education.find({ user: userId }).sort('-startDate'),
      Achievement.find({ user: userId }).sort('-date'),
      Certificate.find({ user: userId }).sort('order'),
      Activity.find({ user: userId }).sort('-date')
    ]);

    res.json({ 
      ...profile.toObject(), 
      username: req.portfolioUser.username, 
      isSetup: true,
      collections: {
        skills, projects, experience, education, achievements, certificates, activities
      }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMyProfile, updateMyProfile, getPublicProfile };
