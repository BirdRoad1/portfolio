import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';
import path from 'path';
import { readFileSync } from 'fs';

export const APIRouter = express.Router();
const DELAY_SECONDS = 3;

const resumePath = path.join('./private/resume.pdf');

APIRouter.get('/resume', (req, res) => {
  const action = req.query.action;
  if (typeof action !== 'string') {
    res.status(400).json({ error: 'missing action' });
    return;
  }

  if (action === 'generate') {
    const signed = jwt.sign(
      {
        purpose: 'resume'
      },
      env.JWT_SECRET,
      {
        expiresIn: '5 minutes',
        notBefore: DELAY_SECONDS
      }
    );

    res.json({
      token: signed,
      delay: DELAY_SECONDS
    });
  } else if (action === 'get') {
    const token = req.query.token;
    if (typeof token !== 'string') {
      res.status(400).json({ error: 'missing token' });
      return;
    }

    try {
      if (jwt.verify(token, env.JWT_SECRET)) {
        res.json({
          file: readFileSync(resumePath, 'base64')
        });
      } else {
        res.status(400).json({ error: 'challenge failed' });
      }
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err);
        res.status(400).json({ error: 'invalid token' });
        return;
      }

      console.log('error while returning resume:', err);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  }
});
