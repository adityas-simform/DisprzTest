import type { Request, Response } from 'express';

import { HEALTH_MESSAGE, HEALTH_STATUS, HTTP_STATUS } from '../constants/api';
import type { ApiSuccessResponse } from '../types/user';
import type { HealthCheckData } from '../types/health';

export const getHealth = (
  _req: Request,
  res: Response<ApiSuccessResponse<HealthCheckData>>,
): void => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      status: HEALTH_STATUS,
    },
    message: HEALTH_MESSAGE,
  });
};
