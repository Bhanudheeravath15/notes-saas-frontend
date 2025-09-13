const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma'); // adjust path if needed

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.json({
    token,
    subscription: {
      noteLimit: user.tenant.noteLimit,
      notesUsed: user.tenant.notesUsed,
    },
  });
};
