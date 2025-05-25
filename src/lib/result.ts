export const resultMessages = {
  USER_CREATED: "Cuenta creada exitosamente.",
  LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  INVALID_CREDENTIALS: "Correo o contraseña incorrectos.",
  UNKNOWN_ERROR: "Ocurrió un error inesperado. Intenta nuevamente.",
  EMAIL_ALREADY_EXISTS: "El correo electrónico ya está en uso.",
  WEAK_PASSWORD: "La contraseña es demasiado débil.",
  INVALID_INPUT: "Hay campos inválidos. Revísalos e intenta de nuevo.",
  CHECK_EMAIL_ERROR: "No se pudo verificar el correo. Intenta nuevamente.",
  SIGNUP_ERROR: "No se pudo registrar la cuenta. Intenta más tarde.",
};

export type ResultCode = keyof typeof resultMessages;
