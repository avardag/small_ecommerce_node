module.exports = {
  getInputErrors(errorsResultObj, inputName) {
    try {
      return errorsResultObj.mapped()[inputName].msg;
    } catch (error) {
      return "";
    }
  },
};
