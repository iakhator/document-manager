function get(req, res) {
  return res.json({ ok: 'none' });
}

function create(req, res) {
  return res.json({ create: 'yes' });
}

export default { get, create };
