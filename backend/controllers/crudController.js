// Generic CRUD controller factory, scoped to the authenticated user so
// every user's portfolio data stays separate from everyone else's.
const createCRUD = (Model) => ({
  // The logged-in user's own items, for the admin dashboard list/edit views
  getMine: async (req, res) => {
    try {
      const items = await Model.find({ user: req.user.id }).sort({ order: 1, createdAt: -1 });
      res.json(items);
    } catch (err) { res.status(500).json({ message: err.message }); }
  },
  // Public items for a given username's portfolio (req.portfolioUser is
  // attached by the resolveUser middleware before this ever runs)
  getPublic: async (req, res) => {
    try {
      const items = await Model.find({ user: req.portfolioUser._id }).sort({ order: 1, createdAt: -1 });
      res.json(items);
    } catch (err) { res.status(500).json({ message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const data = { ...req.body, user: req.user.id };
      if (req.file) {
        data.image = req.file.path.startsWith('http')
          ? req.file.path
          : '/uploads/' + req.file.filename;
      }
      const item = await Model.create(data);
      res.status(201).json(item);
    } catch (err) { res.status(400).json({ message: err.message }); }
  },
  update: async (req, res) => {
    try {
      const data = { ...req.body };
      delete data.user; // ownership can't be changed through this endpoint
      if (req.file) {
        data.image = req.file.path.startsWith('http')
          ? req.file.path
          : '/uploads/' + req.file.filename;
      }
      // Scoped to the owner so nobody can edit another user's item, even
      // if they guess or reuse a valid-looking id.
      const item = await Model.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, data, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { res.status(400).json({ message: err.message }); }
  },
  remove: async (req, res) => {
    try {
      const item = await Model.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
  }
});

module.exports = createCRUD;
