let counter = 0;

export const generateId = (prefix: string = '') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  counter += 1;
  return `${prefix}${timestamp}-${random}-${counter}`;
}; 