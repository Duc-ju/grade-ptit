const validateRequire = (
  field: string | undefined | null,
  fieldName: string
) => {
  if (!field || (field.length && !field.trim()))
    return `Vui lòng nhập ${fieldName}.`;
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (field.length > 200) return `${fieldName} vượt quá 200 ký tự`;
};

const validateLetterAndNumber = (field: string, fieldName: string) => {
  const fieldRequire = validateRequire(field, fieldName);
  if (fieldRequire) return fieldRequire;
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (!/^[A-Za-z0-9]*$/.test(field))
    return `${fieldName} chỉ bao gồm các chữ cái và số`;
};

const validateNumberOnly = (
  field: string | undefined | null,
  fieldName: string
) => {
  const fieldRequire = validateRequire(field, fieldName);
  if (fieldRequire) return fieldRequire;
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (field && !/^[0-9]*$/.test(field))
    return `${fieldName} chỉ được bao gồm các chữ số`;
};

const validateNumberOnlyPositive = (
  field: string | null | undefined,
  fieldName: string
) => {
  const numberOnlyMsg = validateNumberOnly(field, fieldName);
  if (numberOnlyMsg) return numberOnlyMsg;
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (field && Number.parseInt(field) <= 0)
    return `${fieldName} phải có giá trị lớn hơn 0`;
};

const validateStringArray = (field: string, fieldName: string) => {
  const fieldRequire = validateRequire(field, fieldName);
  if (fieldRequire) return fieldRequire;
  fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (!/^[A-Za-z0-9, ]*$/.test(field))
    return `${fieldName} chỉ bao gồm chữ, số và ký tự ','`;
  const split = field
    .split(",")
    .filter((s) => !!s)
    .map((s) => s.trim())
    .filter((s) => !!s);
  if (split.length < 1) return `${fieldName} chưa có giá trị`;
};

const validateEmail = (email: string) => {
  const emailRequire = validateRequire(email, "địa chỉ email");
  if (emailRequire) return emailRequire;
  const isEmail = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (!isEmail) return "Địa chỉ email không đúng định dạng.";
  return "";
};

const validatePassword = (password: string) => {
  const passwordRequire = validateRequire(password, "mật khẩu");
  if (passwordRequire) return passwordRequire;
  if (password.length < 8) return "Mật khẩu phải chứa ít nhất 8 kí tự.";
  return "";
};

const validateFullName = (fullName: string) => {
  const fullNameRequire = validateRequire(fullName, "họ và tên");
  if (fullNameRequire) return fullNameRequire;
};

const validateStudentCode = (studentCode: string) => {
  const studentCodeRequire = validateRequire(studentCode, "mã sinh viên");
  if (studentCodeRequire) return studentCodeRequire;
};

const validateCourse = (course: string) => {
  if (!course) return "Vui lòng chọn khoá học.";
};

const validateMajor = (major: string) => {
  if (!major) return "Vui lòng chọn ngành học.";
};

export {
  validateEmail,
  validatePassword,
  validateFullName,
  validateStudentCode,
  validateCourse,
  validateMajor,
  validateRequire,
  validateStringArray,
  validateNumberOnly,
  validateLetterAndNumber,
  validateNumberOnlyPositive,
};
