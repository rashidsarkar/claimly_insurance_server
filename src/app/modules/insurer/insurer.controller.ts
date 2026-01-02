import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import InsurerServices from './insurer.service';
import sendResponse from '../../utils/sendResponse';

const createInsurer = catchAsync(async (req, res) => {
  const { files } = req;

  if (files && typeof files === 'object') {
    if ('supporting_Documents' in files) {
      req.body.supporting_Documents = files['supporting_Documents'].map(
        (file) => file.path,
      );
    }

    if ('report_Document' in files) {
      req.body.report_Document = files['report_Document'][0].path;
    }
  }

  const result = await InsurerServices.createInsurer(
    req.user.profileId,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Insurer record created successfully',
    data: result,
  });
});

const InsurerController = { createInsurer };
export default InsurerController;
