const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };
  
  const validateMobile = function (mobile) {
    var patt = new RegExp("^[7-9][0-9]{9}$");
    return patt.test(mobile);
  };
  
  const validatePassword = function (password) {
    const patt = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return patt.test(password);
  };
  
  
  module.exports = {
    validateEmail,
    validateMobile,
    validatePassword
  };
  