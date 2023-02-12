import express from 'express';
import { UserModel } from '../database/models/user.js';
var router = express.Router();

// Simple Login / Register without authentication
router.post('/', async function(req, res) {
  try {
    const isExist = await UserModel.findOne({ username: req.body.username });
    if (isExist) {
      return res.status(200).send({ user: isExist })
    }

    const user = await UserModel.create({
      username: req.body.username,
      credits: 100,
    })

    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
})

export default router;
