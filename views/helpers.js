module.exports = {
  getInputErrors(errorsArr, inputName) {
    try {
      return errorsArr.mapped()[inputName].msg;
    } catch (error) {
      return "";
    }
  },
};
