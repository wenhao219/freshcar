import { Request, Response, NextFunction } from "express"

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user_sid) {
    next() // Allow the next middleware or route handler to be called
  } else {
    res.status(401).send("You are not logged in")
  }
}
