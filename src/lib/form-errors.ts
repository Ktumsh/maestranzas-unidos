export const formErrors = {
  required: {
    default: "Este campo es obligatorio.",
    email: "Debes ingresar un correo válido.",
    name: "El nombre es obligatorio.",
    lastName: "El apellido es obligatorio.",
    password: "La contraseña es obligatoria.",
  },
  invalid: {
    email: "El formato del correo no es válido.",
    number: "Debes ingresar un número válido.",
    date: "La fecha ingresada no es válida.",
    phone: "El número de teléfono no es válido.",
    RUT: "El RUT ingresado no es válido.",
    name: "El nombre solo puede contener letras.",
    lastName: "El apellido solo puede contener letras.",
  },
  length: {
    passwordMin: "La contraseña debe tener al menos 8 caracteres.",
    nameMax: "El nombre no puede tener más de 50 caracteres.",
    lastNameMax: "El apellido no puede tener más de 50 caracteres.",
  },
  password: {
    noUppercase: "Debe contener al menos una letra mayúscula.",
    noLowercase: "Debe contener al menos una letra minúscula.",
    noNumber: "Debe contener al menos un número.",
    noSymbol: "Debe contener al menos un carácter especial.",
    mismatch: "Las contraseñas no coinciden.",
  },
  confirmPassword: {
    mismatch: "Las contraseñas no coinciden.",
  },
};
