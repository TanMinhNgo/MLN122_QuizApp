import { Router } from 'express';
import exampleRoutes from './exampleRoutes';

const router = Router();

router.use('/example', exampleRoutes);

// Register more routes here:
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

export default router;
