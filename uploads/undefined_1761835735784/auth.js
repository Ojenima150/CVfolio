// middleware/auth.js

export function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    // keep req.user in sync so other middlewares that read req.user work
    req.user = req.session.user;
    return next();
  }
  res.redirect("/login");
}

export function ensureAdmin(req, res, next) {
  const user = req.user || req.session?.user;
  if (user && (user.role === "main_admin" || user.role === "created_admin")) {
    return next();
  }
  return res.status(403).send("Admin required");
}

export function ensureCreateAdmin(req, res, next) {
  const user = req.user || req.session?.user;
  // ✅ Removed the `.approved` requirement so created_admin can access right away
  if (user && (user.role === "created_admin" || user.role === "main_admin")) {
    return next();
  }
  return res.status(403).send("Not allowed");
}





// export function ensureAuth(req, res, next) {
//   if (req.session && req.session.user) {
//     // keep req.user in sync so other middlewares that read req.user work
//     req.user = req.session.user;
//     return next();
//   }
//   res.redirect("/login");
// }

// export function ensureAdmin(req, res, next) {
//   const user = req.user || req.session?.user;
//   if (user && ((user.role === "main_admin") || (user.role === "created_admin" && user.approved))) {
//     return next();
//   }
//   return res.status(403).send("Admin required");
// }

// export function ensureCreateAdmin(req, res, next) {
//   const user = req.user || req.session?.user;
//   if (user && ((user.role === "created_admin" && user.approved) || user.role === "main_admin")) {
//     return next();
//   }
//   return res.status(403).send("Not allowed");
// }
