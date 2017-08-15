module.exports.registrationSchema = {
  "username": {
    notEmpty: {
      errorMessage: "Username must be specified"
    },
    isAlphanumeric: {
      errorMessage: 'Username must be alphanumeric'
    }
  },
  "firstName": {
    notEmpty: {
      errorMessage: "First Name must be specified"
    },
    isAlphanumeric: {
      errorMessage: 'First name must be alphanumeric'
    }
  },
  "lastName": {
    notEmpty: {
      errorMessage: "Last Name must be specified"
    },
    isAlphanumeric: {
      errorMessage: 'Last name must be alphanumeric'
    }
  },
  "email": {
    notEmpty: {
      errorMessage: "Email must be specified"
    },
    isEmail: {
      errorMessage: "Invalid Email"
    }
  },
  "password": {
    notEmpty: {
      errorMessage: "Password must be specified"
    },
    isLength: {
      options: [{ min: 8}],
      errorMessage: "Password must be at least 8 characters"
    },
    matches: {
      options: ["(?=.*[a-zA-Z])(?=.*[0-9]+).*", "g"],
      errorMessage: "Password must be alphanumeric" // -- @todo
    },
  }

};

module.exports.loginSchema = {
  "username": {
    notEmpty: {
      errorMessage: "Username must be specified"
    },
  },
  "password": {
    notEmpty: {
      errorMessage: "Password must be specified"
    }
  }
};
