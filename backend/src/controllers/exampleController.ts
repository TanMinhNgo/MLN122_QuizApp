import { Request, Response, NextFunction } from 'express';
import { ExampleModel } from '../models/exampleModel';

export const getAll = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const items = ExampleModel.findAll();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const getById = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const id = Number(req.params.id);
    const item = ExampleModel.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { name } = req.body as { name: string };

    if (!name) {
      res.status(400).json({ success: false, message: 'name is required' });
      return;
    }

    const item = ExampleModel.create(name);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};
