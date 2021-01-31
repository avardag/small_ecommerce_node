const { validationResult } = require("express-validator");

module.exports = {
  /** checks for input errors on input validation
   * @param templateFunc function that returns an html template
   * @param dataCb {Function} that returns data we need to pass to template, ie product data
   * @returns template with validation-errors-result object passed in
   */
  handleBodyInputErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errorsResultObj = validationResult(req);

      if (!errorsResultObj.isEmpty()) {
        let data = {}; //product data to be passed to template after error checking in inputs
        if (dataCb) {
          //if callback is provided
          data = await dataCb(req);
        }
        return res.send(templateFunc({ errorsResultObj, ...data }));
      }
      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      res.redirect("/signin");
    }
    next();
  },
};
