import schemas from './schemas';

const validator = {
  logBody: (body: unknown) => schemas.validate(body),
};

export default validator;
