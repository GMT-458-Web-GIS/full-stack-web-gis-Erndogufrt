const jwt = require('jsonwebtoken');

// Token doğrulama
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send("Jeton (Token) gerekli!");

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Geçersiz Jeton!");
  }
};

// Rol Kontrolü (Sultan, Commander vs.)
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok!" });
    }
    next();
  };
};
