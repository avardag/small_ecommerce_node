const { validationResult } = require("express-validator");

module.exports = {
  handleBodyInputErrors(templateFunc) {
    return (req, res, next) => {
      const errorsResultObj = validationResult(req);

      if (!errorsResultObj.isEmpty()) {
        return res.send(templateFunc({ errorsResultObj }));
      }
      next();
    };
  },
};
